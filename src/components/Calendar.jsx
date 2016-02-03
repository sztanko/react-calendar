import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import MonthD3 from './MonthD3';
const Month = MonthD3;
//import Month from './Month';


export default React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    dataFormatter: React.PropTypes.func,
    startDate: React.PropTypes.string.isRequired,
    endDate: React.PropTypes.string,
    monthPadding: React.PropTypes.number,
    shouldUpdate: React.PropTypes.bool,
    onMouseOver: function(dt){},
    onMouseOut: function(dt){},
    onClick: function(dt){}
  },

   getDefaultProps: function() {
    return {
      width: 1200,
      endDate: moment().format("YYYY-MM"),
      monthPadding: 5,
      transform: "",
      shouldUpdate: true,
      dataFormatter: function(x) {
        return {};
      }
    };
  },

shouldComponentUpdate: function(np, ns){
    //return true;
    return np.shouldUpdate;
},

  render() {
    const fr = moment(this.props.startDate).startOf('month');
    const to = moment(this.props.endDate).startOf('month'); //.add(1, 'month');
    const captionShift = 70;
    const width = this.props.width - captionShift -2;
    const dayWidth = Math.floor(width / 52);
    const monthPadding = this.props.monthPadding;
    const monthHeight = 7 * dayWidth + monthPadding;
    const mapHeight = Math.ceil( 1 + moment.duration(to - fr).asYears()) * monthHeight;
    
    const months = _(_.range(0, moment.duration(to - fr).asMonths()))
    
      .map((m) => {
        return fr.clone().add(m, 'months')
      })
      .map((m, i) => {
        const xshift = (m.week() - 1) * dayWidth + 1 + captionShift;
        const yshift = (m.year() - fr.year()) * monthHeight + 1;
        const transform=`translate(${xshift}, ${yshift})`;
        return (<Month key={i} transform={transform} dayWidth={dayWidth}  
            dayHeight={dayWidth} month={m} 
            dataFormatter={this.props.dataFormatter}
            onMouseOver={this.props.onMouseOver}
            onMouseOut={this.props.onMouseOut}
            onClick={this.props.onClick}
            />);
      })
      .value();
    const years = 
    _(_.range(0, to.year() - fr.year() + 1))
        .map((i) => {
            const y = 4.5 * dayWidth;
            const x = 10;
            const yOffset = i * monthHeight;
            return (<text key={i} x={x} y={y + yOffset}>{i+fr.year()}</text>)
            })
        .value();
    return (
      <div className="calendar">
      <svg width={this.props.width} height={mapHeight + 2}>{months}
      <g className="years">{years}</g></svg></div>);
  }
});
