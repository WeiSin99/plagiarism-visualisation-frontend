import { useEffect, useState } from 'react';
import { scaleSequential } from 'd3-scale';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import {
  forceSimulation,
  forceLink,
  forceCollide,
  forceCenter,
  forceManyBody,
} from 'd3-force';

import useResponsiveWidth from '../../hooks/useResponsiveWidth';

const DocumentViz = ({ report }) => {
  const [containerRef, width] = useResponsiveWidth();
  const [animatedNodes, setAnimatedNodes] = useState([]);

  // force simulation
  useEffect(() => {
    const colorScale = scaleSequential()
      .domain([1, 0])
      .interpolator(interpolateRdYlBu);

    const nodes = report.potential_sources.map((source, i) => {
      return {
        id: source,
        color: colorScale(report.scores[i]),
      };
    });
    nodes.push({ id: 0, color: 'black' });

    const links = report.potential_sources.map((source, i) => {
      return {
        source: 0,
        target: source,
        score: report.scores[i],
      };
    });

    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink(links)
          .id(d => d.id)
          .strength(d => d.score)
      )
      .force('center', forceCenter(width / 2, 250))
      .force('collide', forceCollide(11))
      .force('charge', forceManyBody().strength(-150));

    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
    });

    return () => simulation.stop();
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="w-full">
      <svg width="100%" height={500}>
        {animatedNodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={10}
            fill={node.color}
          />
        ))}
      </svg>
    </div>
  );
};

export default DocumentViz;
