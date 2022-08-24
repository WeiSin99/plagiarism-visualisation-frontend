import { useEffect, useState } from 'react';
import { extent, min } from 'd3-array';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateOrRd } from 'd3-scale-chromatic';
import {
  forceSimulation,
  forceCollide,
  forceLink,
  forceCenter,
  forceManyBody,
} from 'd3-force';

import Tooltip from '../../components/Tooltip';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';

const height = 500;

const DetailAnalysisViz = ({ plagReport, setCaseNum }) => {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [containerRef, width] = useResponsiveWidth();

  useEffect(() => {
    if (!!Object.keys(plagReport).length) {
      const radiusExtent = extent(plagReport.detectedCases, d => d.thisLength);
      let radiusScale = scaleLinear().domain(radiusExtent).range([10, 100]);
      if (plagReport.detectedCases.length === 1) {
        radiusScale = scaleLinear()
          .domain([0, plagReport.charLength])
          .range([10, 250]);
      }

      const allScores = plagReport.detectedCases.map(c => {
        return c.averageScore;
      });
      const minScore = min(allScores);
      const colorScale = scaleSequential()
        .domain([minScore, 1])
        .interpolator(interpolateOrRd);

      const nodes = plagReport.detectedCases.map((c, idx) => {
        return {
          id: idx,
          r: radiusScale(c.thisLength),
          color: colorScale(c.averageScore),
        };
      });
      const links = plagReport.intersectedCases.map(intersectedCase => {
        return {
          source: intersectedCase.source,
          target: intersectedCase.target,
          color: '#000',
          strokeWidth: 3,
        };
      });

      const simulation = forceSimulation(nodes)
        .force(
          'link',
          forceLink(links)
            .id(d => d.id)
            .strength(0.5)
        )
        .force('center', forceCenter(width / 2, height / 2))
        .force(
          'collide',
          forceCollide().radius(d => d.r + 1)
        )
        .force('charge', forceManyBody().strength(-5))
        .force('bounds', () => {
          nodes.forEach(node => {
            node.x = Math.max(node.r, Math.min(width - node.r, node.x));
            node.y = Math.max(node.r, Math.min(height - node.r, node.y));
          });
        });

      simulation.on('tick', () => {
        setAnimatedNodes([...simulation.nodes()]);
        setAnimatedLinks([...links]);
      });

      return () => simulation.stop();
    }
  }, [plagReport, width]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    !!Object.keys(plagReport).length &&
    plagReport.detectedCases.length === 0
  ) {
    return <></>;
  }

  return (
    <>
      <Tooltip>
        <ul className="list-disc list-inside">
          <li className="mt-1">Each circle represents a plagiarised part.</li>
          <li className="mt-1">
            <strong className="text-blue-600">The size</strong> of the circles
            indicates the length of plagiarised parts, and the
            <strong className="text-blue-600">intensity of red</strong> of the
            circles indicates the similarity between the plagiarised parts and
            their sources.
          </li>
          <li className="mt-1">
            Two <strong className="text-blue-600">linked circles</strong>{' '}
            indicate that the two corresponding plagiarised parts contain{' '}
            <strong className="text-blue-600">overlapped parts</strong>. For
            example, a sentence in the suspicious document is similar to two
            different sentences from two different documents.
          </li>
          <li className="mt-1">
            <strong className="text-blue-600">Clicking</strong> on a circle will
            select the plagiarised part as the "selected plagiarised part" and
            navigate you to that part of the document.
          </li>
        </ul>
      </Tooltip>
      <div
        id="detailAnalysisViz"
        ref={containerRef}
        className="w-full col-span-1"
      >
        <svg width="100%" height={height}>
          {animatedNodes.map(node => (
            <circle
              onClick={() => setCaseNum(node.id)}
              className="cursor-pointer"
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              data-id={node.id}
            ></circle>
          ))}
          {animatedLinks.map(link => (
            <line
              key={link.index}
              stroke={link.color}
              strokeWidth={link.strokeWidth}
              opacity={0.5}
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
            />
          ))}
        </svg>
      </div>
    </>
  );
};

export default DetailAnalysisViz;
