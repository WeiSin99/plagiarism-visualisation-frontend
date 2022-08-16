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
        .strength(1)
        .distance(20)
    )
    .force('center', forceCenter(width / 2, height / 2).strength(1))
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
    let nodes = report.response.map(result => {
      return {
        id: result.id,
        title: result.title,
        r: 10 + result.sources.length,
      };
    });

    const links = report.response
      .map(result => {
        if (!result.sources.length) return undefined;
        return result.sources.map(s => {
          return {
            source: result.id,
            target: s,
            color: '#ccc',
            strokeWidth: 3,
          };
        });
      })
      .filter(link => link != null)
      .flat();

    let strength = -6;
    if (filter !== 'All') {
      nodes = getLinkedNodes(nodes, links);
      strength = -15;
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
      link.strokeWidth = 3;
    });
    setAnimatedLinks([...animatedLinks]);
    setTooltipStyle({ left: e.pageX + 8, top: e.pageY - 40, opacity: 0.8 });
    setTooltipText(e.target.dataset.title);
  };

  const mouseLeaveNode = e => {
    const color = e.target.dataset.fill;
    e.target.setAttribute('fill', color);

    animatedLinks.forEach(link => {
      link.color = '#ccc';
      link.strokeWidth = 3;
    });
    setAnimatedLinks([...animatedLinks]);
    setTooltipStyle({ left: 0, top: 0, opacity: 0 });
    setTooltipText('');
  };

  const mouseClick = e => {
    const id = e.target.dataset.id;
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div
        className="absolute bg-blue-200 text-center text-sm font-semibold rounded-lg p-2"
        style={tooltipStyle}
      >
        {tooltipText}
      </div>
      <div ref={containerRef} className="w-full">
        <svg width="100%" height={height}>
          {animatedNodes.map(node => (
            <circle
              className="cursor-pointer"
              onMouseEnter={mouseEnterNode}
              onMouseLeave={mouseLeaveNode}
              onClick={mouseClick}
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              data-fill={node.color}
              data-title={node.title}
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
