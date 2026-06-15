import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const COLORS = ['#667846', '#a56c43', '#819363', '#b88562', '#4f5e34', '#caa386'];

export default function D3DonutChart({ data }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius - 30; // Donut

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal().range(COLORS);

    const pie = d3.pie()
      .value(d => d.value)
      .padAngle(0.04)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .style('transition', 'fill 0.2s')
      .on('mouseover', function() {
        d3.select(this).style('opacity', 0.8);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 1);
      });

  }, [data]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} />
    </div>
  );
}
