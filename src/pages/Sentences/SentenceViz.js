import { useEffect, useState } from 'react';
import { extent, min } from 'd3-array';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateOrRd } from 'd3-scale-chromatic';
import {
  forceSimulation,
  forceCollide,
  forceCenter,
  forceManyBody,
} from 'd3-force';

import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import CompareView from './CompareView';

const height = 500;

const SentenceViz = ({ report }) => {
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [selectedCase, setSelectedCase] = useState(0);
  const [containerRef, width] = useResponsiveWidth();

  useEffect(() => {
    const radiusExtent = extent(
      report['potential-case'],
      d => d.sentence.length
    );
    const radiusScale = scaleLinear().domain(radiusExtent).range([10, 100]);

    const allScores = report['potential-case'].flatMap(c => {
      return c.source.map(s => s['average-score']);
    });
    const minScore = min(allScores);
    const colorScale = scaleSequential()
      .domain([minScore, 1])
      .interpolator(interpolateOrRd);

    const nodes = report['potential-case'].map((c, idx) => {
      return {
        id: idx,
        r: radiusScale(c.sentence.length),
        color: colorScale(c.source[0]['average-score']),
      };
    });

    const simulation = forceSimulation(nodes)
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
    });

    return () => simulation.stop();
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div ref={containerRef} className="w-full col-span-1">
          <svg width="100%" height={height}>
            {animatedNodes.map(node => (
              <circle
                onClick={() => setSelectedCase(node.id)}
                className="cursor-pointer"
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.color}
                data-id={node.id}
              ></circle>
            ))}
          </svg>
        </div>
        <div className="col-span-2">
          <CompareView plagCase={report['potential-case'][selectedCase]} />
        </div>
      </div>
    </>
  );
};

export default SentenceViz;
