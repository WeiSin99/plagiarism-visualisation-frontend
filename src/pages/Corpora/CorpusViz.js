import { ChevronDownIcon } from '@heroicons/react/solid';
import { useEffect, useState, useRef } from 'react';
import {
  forceSimulation,
  forceLink,
  forceCollide,
  forceCenter,
  forceManyBody,
} from 'd3-force';

const height = 500;

const CorpusViz = ({ report }) => {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [tooltipPosition, setTooltipPosition] = useState({
    left: 0,
    top: 0,
    opacity: 0,
  });
  const [tooltipText, setTooltipText] = useState('');
  const [filter, setFilter] = useState('All');
  const [filterActive, setFilterActive] = useState(false);

  // set width on resizing
  useEffect(() => {
    setWidth(containerRef.current.clientWidth);

    let timeoutId;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(containerRef.current.clientWidth);
      }, 300);
    };
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      const linkedNodes = [
        ...new Set(links.flatMap(l => [l.source, l.target])),
      ];
      nodes = nodes.filter(n => linkedNodes.includes(n.id));
      strength = -100;
    }

    const simulation = forceSimulation(nodes)
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
      .force('charge', forceManyBody().strength(strength))
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
  }, [width, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = e => {
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
    setTooltipPosition({ left: e.pageX + 8, top: e.pageY - 40, opacity: 0.8 });
    setTooltipText(`suspicious-document${id}`);
  };

  const handleMouseLeave = e => {
    const color = e.target.dataset.fill;
    e.target.setAttribute('fill', color);

    animatedLinks.forEach(link => {
      link.color = '#ccc';
      link.strokeWidth = 1;
    });
    setAnimatedLinks([...animatedLinks]);
    setTooltipPosition({ left: 0, top: 0, opacity: 0 });
    setTooltipText('');
  };

  const handleClick = item => {
    setFilter(item);
    setFilterActive(false);
  };

  return (
    <>
      <div
        ref={tooltipRef}
        className="absolute bg-blue-200 text-center text-sm rounded-lg p-2"
        style={tooltipPosition}
      >
        {tooltipText}
      </div>
      <div className="relative inline-block text-left mb-10">
        <div>
          <button
            onClick={() => setFilterActive(!filterActive)}
            type="button"
            className="inline-flex justify-center w-full rounded-full border border-primary-500 shadow-sm px-4 py-2.5 bg-white text-xl font-medium text-primary-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            aria-haspopup="true"
          >
            {filter}
            <ChevronDownIcon
              className="ml-2 h-6 w-6 self-center"
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          className={`origin-top-left absolute w-[500px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 mt-2 focus:outline-none py-2 ${
            filterActive ? 'visible' : 'invisible'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          {['All', 'Only Linked Documents'].map(item => (
            <button
              key={item}
              onClick={() => handleClick(item)}
              className="block w-full text-gray-700 text-base text-left px-4 py-2 hover:bg-gray-50 hover:text-primary-600"
              role="menuitem"
              tabIndex="-1"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="w-full">
        <svg width="100%" height={height}>
          {animatedNodes.map(node => (
            <circle
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
