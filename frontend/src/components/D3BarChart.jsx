import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function D3BarChart({ data, keys }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !keys || keys.length === 0) return;
    
    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 25, right: 10, left: 20, bottom: 30 };
    const container = containerRef.current;
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Setup scales
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
      .rangeRound([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#3B82F6', '#10B981', '#8B5CF6']);

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(5))
      .selectAll('line')
      .attr('stroke', '#f6f0e3')
      .attr('stroke-dasharray', '3 3');
    svg.select('.grid path').remove();

    // Bars
    const group = svg.append('g')
      .selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', d => `translate(${x0(d.name)},0)`);

    group.selectAll('rect')
      .data(d => keys.map(key => ({ key, value: d[key] })))
      .enter().append('rect')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', d => color(d.key))
      .attr('rx', 4);

    // Labels
    group.selectAll('text')
      .data(d => keys.map(key => ({ key, value: d[key] })))
      .enter().append('text')
      .attr('x', d => x1(d.key) + x1.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', '#734d2f')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .text(d => d.value);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .selectAll('text')
      .style('fill', '#a36d4a')
      .style('font-weight', '600')
      .style('font-size', '12px');
    svg.select('.domain').remove();

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(0))
      .selectAll('text')
      .style('fill', '#a36d4a')
      .style('font-weight', '600')
      .style('font-size', '12px');
    svg.select('.domain').remove();

  }, [data, keys]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} />
    </div>
  );
}
