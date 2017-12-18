import React, { Component } from 'react';
import { bool } from 'prop-types';

class Loader extends Component {
  static propTypes = {
    show: bool,
  };

  static defaultProps = {
    show: false,
  };

  setFilter = (path, el) => {
    el.style.filter = path;
    el.style.webkitFilter = path;
  };

  jump = () => {
    const jumpTL = new TimelineMax();

    jumpTL
      .set([jumpArc, jumpArcReflection], {
        drawSVG: '0% 0%',
      })
      .set([circleL, circleR], {
        attr: {
          rx: 0,
          ry: 0,
        },
      })
      .to([jumpArc, jumpArcReflection], BASE_DURATION_MULTIPLIER * 0.4, {
        drawSVG: '0% 30%',
        ease: Linear.easeNone,
      })

      // scale up the ripple ovals (with x scaling a bit more since, you know, it's a horizontal oval :-) )
      .to(
        circleL,
        BASE_DURATION_MULTIPLIER * 2,
        {
          attr: {
            rx: '+=30',
            ry: '+=10',
          },
          opacity: 0, // ripple, then fade out
          ease: Power1.easeOut,
        },
        '-=0.1',
      )

      .to(
        [jumpArc, jumpArcReflection],
        BASE_DURATION_MULTIPLIER * 1.0,
        {
          drawSVG: '50% 80%',
          ease: Linear.easeNone,
        },
        '-=1.9',
      )

      .to(
        [jumpArc, jumpArcReflection],
        BASE_DURATION_MULTIPLIER * 0.7,
        {
          drawSVG: '100% 100%',
          ease: Linear.easeNone,
        },
        '-=0.9',
      )

      // finish by animating the right circle ripple
      .to(
        circleR,
        BASE_DURATION_MULTIPLIER * 2,
        {
          attr: {
            rx: '+=30',
            ry: '+=10',
          },
          opacity: 0, // ripple, then fade out
          ease: Power1.easeOut,
        },
        '-=0.5',
      );

    jumpTL.timeScale(3);

    return jumpTL;
  };

  render() {
    return (
      <div className="Loader">
        <svg className="svg-def">
          <defs>
            {/* a glow that takes on the stroke color of the object it's applied to */}
            <filter id="strokeGlow" y="-10" x="-10" width="250" height="150">
              <feOffset in="StrokePaint" dx="0" dy="0" result="centeredOffset" />

              <feGaussianBlur in="centeredOffset" stdDeviation="2" result="blur1" />
              <feGaussianBlur in="centeredOffset" stdDeviation="5" result="blur2" />
              <feGaussianBlur in="centeredOffset" stdDeviation="15" result="blur3" />

              <feMerge>
                {/* <!-- this contains the offset blurred image --> */}
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur3" />

                {/* <!-- this contains the element that the filter is applied to --> */}
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <div className="main-view-container">
          <div className="loader-container">
            <svg
              id="loader"
              xmlns="http://www.w3.org/2000/svg"
              width="250px"
              height="200px"
              viewBox="0 0 250 200"
            >
              <svg style="overflow: visible">
                <path
                  id="jump"
                  fill="none"
                  stroke="#33FFFF"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  d="M55.5 98.5c0-35.3 31.3-64 70-64s70 28.7 70 64"
                />
              </svg>

              <g
                fill="none"
                strokeWidth="1"
                stroke="#33FFFF"
                strokeLinecap="round"
                strokeMiterlimit="10"
              >
                <ellipse id="circleL" cx="55.2" cy="102.5" rx="21.7" ry="5.5" />
                <ellipse id="circleR" cx="195.2" cy="103.5" rx="21.7" ry="5.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default Loader;
