import React, { useEffect, useRef } from 'react';
import { CandidateMatch, RequirementSimulation } from '../types';
import { BarChart2, CheckCircle } from 'lucide-react';

interface ChartVisualizationProps {
  matchData: CandidateMatch;
  simulations: RequirementSimulation[];
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({
  matchData,
  simulations
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Helper function to format parameter names in Japanese
  const formatParameter = (param: string): string => {
    const paramMap: Record<string, string> = {
      'jobType.major': '職種大',
      'jobType.middle': '職種中',
      'jobType.minor': '職種小',
      'hourlyWage': '時給',
      'workArea.prefecture': '都道府県',
      'workArea.city': '市区町村',
      'skillRequirements': 'スキル要件',
      'workHours': '勤務時間',
      'workDays': '勤務曜日'
    };
    
    return paramMap[param] || param;
  };
  
  // Filter positive simulations
  const positiveSimulations = simulations.filter(sim => sim.percentageIncrease > 0);
  
  useEffect(() => {
    if (!canvasRef.current || positiveSimulations.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    
    // Define chart dimensions
    const chartMargin = {top: 40, right: 30, bottom: 60, left: 60};
    const chartWidth = canvasWidth - chartMargin.left - chartMargin.right;
    const chartHeight = canvasHeight - chartMargin.top - chartMargin.bottom;
    
    // Get data for chart
    const labels = ['現在', ...positiveSimulations.map(sim => formatParameter(sim.parameter))];
    const currentData = [matchData.matchCount, ...positiveSimulations.map(() => matchData.matchCount)];
    const newData = [matchData.matchCount, ...positiveSimulations.map(sim => matchData.matchCount + sim.matchIncrease)];
    
    // Calculate max value for y-axis
    const maxValue = Math.max(...newData) * 1.2;
    
    // Draw chart background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.fillText('条件調整による候補者数変化', canvasWidth / 2, 25);
    
    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(chartMargin.left, chartMargin.top);
    ctx.lineTo(chartMargin.left, chartMargin.top + chartHeight);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(chartMargin.left, chartMargin.top + chartHeight);
    ctx.lineTo(chartMargin.left + chartWidth, chartMargin.top + chartHeight);
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Draw y-axis labels and grid lines
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'right';
    
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const value = Math.round((maxValue / yTicks) * i);
      const yPos = chartMargin.top + chartHeight - (chartHeight * i / yTicks);
      
      ctx.fillText(value.toString(), chartMargin.left - 10, yPos + 4);
      
      // Draw horizontal grid line
      if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(chartMargin.left, yPos);
        ctx.lineTo(chartMargin.left + chartWidth, yPos);
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // Calculate bar width
    const barWidth = chartWidth / (labels.length * 2 + 1);
    const barSpacing = barWidth * 0.2;
    
    // Draw bars and labels
    labels.forEach((label, i) => {
      const xPos = chartMargin.left + (i * 2 + 1) * barWidth;
      
      // Draw current data bar (blue)
      const currentValue = currentData[i];
      const currentBarHeight = (currentValue / maxValue) * chartHeight;
      const currentYPos = chartMargin.top + chartHeight - currentBarHeight;
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(xPos, currentYPos, barWidth - barSpacing, currentBarHeight);
      
      // Draw new data bar (green) - only for simulations
      if (i > 0) {
        const newValue = newData[i];
        const newBarHeight = (newValue / maxValue) * chartHeight;
        const newYPos = chartMargin.top + chartHeight - newBarHeight;
        
        ctx.fillStyle = '#10b981';
        ctx.fillRect(xPos + barWidth, newYPos, barWidth - barSpacing, newBarHeight);
        
        // Draw value labels
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'center';
        ctx.fillText(newValue.toString(), xPos + barWidth + (barWidth - barSpacing) / 2, newYPos - 5);
      } else {
        // Draw current value label
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'center';
        ctx.fillText(currentValue.toString(), xPos + (barWidth - barSpacing) / 2, currentYPos - 5);
      }
      
      // Draw x-axis labels
      ctx.font = '11px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      
      // Wrap long labels
      const maxLabelWidth = barWidth * 2;
      const words = label.split('');
      let line = '';
      let lineCount = 0;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxLabelWidth && n > 0) {
          ctx.fillText(line, xPos + barWidth, chartMargin.top + chartHeight + 15 + (lineCount * 12));
          line = words[n];
          lineCount++;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, xPos + barWidth, chartMargin.top + chartHeight + 15 + (lineCount * 12));
    });
    
    // Draw legend
    const legendY = chartMargin.top - 15;
    
    // Current legend item
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(chartMargin.left, legendY, 15, 12);
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('現在', chartMargin.left + 20, legendY + 9);
    
    // New legend item (only if there are simulations)
    if (positiveSimulations.length > 0) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(chartMargin.left + 80, legendY, 15, 12);
      ctx.fillStyle = '#1f2937';
      ctx.fillText('調整後', chartMargin.left + 100, legendY + 9);
    }
    
  }, [matchData, positiveSimulations]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          データ可視化
        </h2>
      </div>
      
      <div className="p-6">
        {positiveSimulations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            <p className="text-gray-600 font-medium">現状の条件が最適です</p>
            <p className="text-sm text-gray-500 mt-1">
              改善可能なシミュレーションデータがありません
            </p>
          </div>
        ) : (
          <div className="h-64 relative">
            <canvas 
              ref={canvasRef}
              width={600}
              height={250}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartVisualization;