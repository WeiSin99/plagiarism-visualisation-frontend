import { useEffect, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceCollide,
  forceCenter,
  forceManyBody,
} from 'd3-force';

import useResponsiveWidth from '../../hooks/useResponsiveWidth';

const height = 500;

const forceGraph = (nodes, links, width, height, charge) => {
  return forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id(d => d.id)
        .strength(d => d.score / 10)
    )
    .force('center', forceCenter(width / 2, height / 2))
    .force(
      'collide',
      forceCollide().radius(d => d.r + 1)
    )
    .force('charge', forceManyBody().strength(charge))
    .force('bounds', () => {
      nodes.forEach(node => {
        node.x = Math.max(node.r, Math.min(width - node.r, node.x));
        node.y = Math.max(node.r, Math.min(height - node.r, node.y));
      });
    });
};

const getLinkedNodes = (nodes, links) => {
  const linkedNodes = [...new Set(links.flatMap(l => [l.source, l.target]))];
  return nodes.filter(n => linkedNodes.includes(n.id));
};

const CorpusViz = ({ report, filter }) => {
  const [containerRef, width] = useResponsiveWidth();
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipStyle, setTooltipStyle] = useState({
    left: 0,
    top: 0,
    opacity: 0,
  });

  useEffect(() => {
    let nodes = Object.entries(report).map(([docNum, result]) => {
      return {
        id: docNum,
        r: 10 + result.source.length,
      };
    });

    const links = Object.entries(report)
      .map(([docNum, result]) => {
        if (!result.source.length) return undefined;
        return result.source.map((s, i) => {
          return {
            source: docNum,
            target: s.toString(),
            score: result.scores[i],
            color: '#ccc',
            strokeWidth: 1,
          };
        });
      })
      .filter(link => link != null)
      .flat();

    let strength = -6;
    if (filter !== 'All') {
      nodes = getLinkedNodes(nodes, links);
      strength = -100;
    }

    const simulation = forceGraph(nodes, links, width, height, strength);
    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
      setAnimatedLinks([...links]);
    });

    return () => simulation.stop();
  }, [width, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const mouseEnterNode = e => {
    e.target.setAttribute('fill', 'rgb(153, 202, 225)');
    const id = e.target.dataset.id;

    const connectedLinks = animatedLinks.filter(
      link => link.target.id === id || link.source.id === id
    );
    connectedLinks.forEach(link => {
      link.color = 'rgb(255, 120, 72)';
      link.strokeWidth = 2;
    });
    setAnimatedLinks([...animatedLinks]);
    setTooltipStyle({ left: e.pageX + 8, top: e.pageY - 40, opacity: 0.8 });
    setTooltipText(`suspicious-document${id}`);
  };

  const mouseLeaveNode = e => {
    const color = e.target.dataset.fill;
    e.target.setAttribute('fill', color);

    animatedLinks.forEach(link => {
      link.color = '#ccc';
      link.strokeWidth = 1;
    });
    setAnimatedLinks([...animatedLinks]);
    setTooltipStyle({ left: 0, top: 0, opacity: 0 });
    setTooltipText('');
  };

  return (
    <>
      <div
        className="absolute bg-blue-200 text-center text-sm rounded-lg p-2"
        style={tooltipStyle}
      >
        {tooltipText}
      </div>
      <div ref={containerRef} className="w-full">
        <svg width="100%" height={height}>
          {animatedNodes.map(node => (
            <circle
              onMouseEnter={mouseEnterNode}
              onMouseLeave={mouseLeaveNode}
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              data-fill={node.color}
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

export default CorpusViz;
