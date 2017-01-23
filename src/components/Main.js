require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';
let imageDatas = require('json!../data/imageData.json');

imageDatas = ((imageDatasArr) => {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);


var get30DegRandom = () => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

class ImgFigure extends React.Component {
    constructor(props){super(props);this.handleClick = this.handleClick.bind(this);}

    handleClick(e){
        if (this.props.arrange.isCenter) {
          this.props.inverse()
        } else {
          this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render() {

        let styleObj = {};
        if (this.props.arrange.pos) {
          styleObj = this.props.arrange.pos;
        }
        if(this.props.arrange.rotate) {
            let rotate = this.props.arrange.rotate;
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
              styleObj[value] = 'rotate(' + rotate + 'deg)';
            });
        }

        if(this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img width="240px" height="240px" src={this.props.data.imageURL}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                          {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}



class GalleryByReactApp extends React.Component {
    constructor(props){
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { 
                x: [0, 0],
                topY: [0, 0]
            }
        }
        this.state = {
            imgsArrangeArr: []
        }
    }

  inverse(index) {
    return () => {
      let imgsArrangArr = this.state.imgsArrangeArr;
      imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangArr
      })
    }
  }

  center(index) {
    return () => {
      this.rearrange(index);
    }
  }
    
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
                Constant = this.Constant,
                centerPos = Constant.centerPos,
                hPosRange = Constant.hPosRange,
                vPosRange = Constant.vPosRange,
                hPosRangeLeftSecX = hPosRange.leftSecX,
                hPosRangeRightSecX = hPosRange.rightSecX,
                hPosRangeY = hPosRange.y,
                vPosRangeTopY = vPosRange.topY,
                vPosRangeX = vPosRange.x,
                topImgNum = Math.floor(Math.random() * 2),
                topImgSpiceIndex = 0,
                imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
                imgsArrangeCenterArr[0] = {
                    pos: centerPos,
                    rotate: 0,
                    isCenter: true
                  }
        topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        let imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
        imgsArrangTopArr.forEach((value, index) => {
          imgsArrangTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false

          };
        });
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          let hPosRangeLORX = null;
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX
          }
          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        }
        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
          imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
      }



    componentDidMount() {
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW / 2),
          halfStageH = Math.ceil(stageH / 2);

        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW- halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
    }

    render() {
        let imgFigures = [];
        imageDatas.forEach((value, index) =>{
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(
                <ImgFigure 
                    data = {value} 
                    key={index} 
                    ref={'imgFigures'+index} 
                    arrange = {this.state.imgsArrangeArr[index]}  
                    inverse={this.inverse(index)}
                    center={this.center(index)} />
                );
        });
        return (
            <section className="stage" ref="stage" id="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
            </section>
        )
    }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
