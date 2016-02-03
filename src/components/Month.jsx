import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames/bind';

export default React.createClass({
  propTypes: {
    month: React.PropTypes.instanceOf(moment).isRequired,
    dayWidth: React.PropTypes.number,
    dayHeight: React.PropTypes.number,
    dataFormatter: React.PropTypes.func,
    transform: React.PropTypes.string,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onClick: React.PropTypes.func
  },

  getInitialState: function() {return {}},

  getDefaultProps: function() {
    return {
      dayWidth: 10,
      dayHeight: 5,
      transform: "",
      dataFormatter: function(x) {
        return {};
      },
      onMouseOver: function(e){},
      onMouseOut: function(e){},
      onClick: function(e){}
    };
  },


  drawBorder: function(){
    const lastDay = this.props.month.clone().endOf('month');
  
    const dayWidth = this.props.dayWidth;
    const dayHeight = this.props.dayHeight;

    const firstPointY = this.props.month.weekday() * dayHeight;
    const bottom = 7 * dayHeight;
    const lastPointX = Math.floor((lastDay.dayOfYear() - (this.props.month.dayOfYear() - this.props.month.weekday()))/7) * dayWidth;
    
    const lastPointY = (lastDay.weekday() ) * dayHeight;
    return `M0 ${firstPointY} V${bottom} H${lastPointX} V${lastPointY + dayHeight} H${lastPointX + dayWidth} V0 H${dayWidth} V${firstPointY} Z`
  },

  componentWillReceiveProps: function(np){
    if(this.props.month.isSame(np.month, "month") && this.props.dayWidth === np.dayWidth && this.props.dayHeight === np.dayHeight)
        return;
    this.setState({'coords': this.getCoords(np)});

  },

  getCoords: function(props){
    //console.log("Rendering coords");
    const offset = props.month.weekday()
    const today = moment();
    const dayProps = _(_.range(0, props.month.daysInMonth()))
      .map((d) => {
        return props.month.clone().add(d, 'day');
      })
      .sortBy((d) => {return d.isSame(today, 'day');})
      .map((d) => {
        const daysFromFirstMonday = d.date() - 1 + offset;
        const leftPos = Math.floor(daysFromFirstMonday / 7);
        const topPos = d.weekday();
        let todayDayClass = "";
        if (d.isSame(today, 'day'))
        {
          todayDayClass = 'today';
        }
        const cn = {
          'today': d.isSame(today, 'day')
        };
        const dt = d.format('YYYY-MM-DD');
        cn[dt] = true;
        return (
          {
            d: d,
            className: classNames(cn), 
            x: leftPos * props.dayWidth,  
            width: props.dayWidth, 
            y: topPos * props.dayHeight, 
            height: props.dayHeight,
            onMouseOver: (e) => {props.onMouseOver(d)}, 
            onMouseOut: (e) => { console.log('out'); props.onMouseOut(d)},
            onClick: (e) => { props.onClick(d)},
            
          })
        })
        .value();
        return dayProps;

  },

  render: function() {
    //console.time('d3 render');d3.selectAll('rect').style('fill', 'white'); console.timeEnd('d3 render');
    //console.time("rendering month");
    const dayProps = this.state.coords?this.state.coords:this.getCoords(this.props);
    //const dayProps = this.getCoords(this.props);
    const dayRects = _(dayProps).map( (d, i) => {
          return (<rect {...d} key={i} style={this.props.dataFormatter(d.d)} />);
        })
        .value();

      const path=<path d={this.drawBorder()} className="month_border"/>
      //console.timeEnd("rendering month");
      return (<g className={this.props.month.format("MMMM YYYY")} transform={this.props.transform}><g className='cells'>{dayRects}</g>{path}</g>);
    }
  });
