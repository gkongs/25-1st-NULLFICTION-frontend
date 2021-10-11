import React, { Component } from 'react';
import './ProductImage.scss';

const IMAGE_WIDTH = 550;
const MIN_GAP = IMAGE_WIDTH * 0.1; // 1/10 만큼 이동하면 다음 이미지로

class ProductImage extends Component {
  constructor() {
    super();
    this.state = {
      focusIdx: 0,
    };
    // 드래그 관련 Ref
    this.isDragRef = React.createRef();
    this.isDragRef.current = false;
    this.dragPosRef = React.createRef();
    this.dragPosRef.current = {
      originPosX: 0,
      startPosX: 0,
    };
    this.imgContainerRef = React.createRef();
  }

  dragStart = e => {
    e.preventDefault();
    if (this.isDragRef.current === false) {
      const { offsetX: endPosX } = e.nativeEvent;
      this.isDragRef.current = true;
      this.dragPosRef.current.prevPosX = endPosX;
    }
  };

  dragMove = e => {
    this.isDragRef.current && this.changeImagePos(e);
  };

  dragEnd = (e, maxPos) => {
    if (this.isDragRef.current) {
      const { originPosX, prevPosX } = this.dragPosRef.current;
      const { offsetX: endPosX } = e.nativeEvent;
      const gap = endPosX - prevPosX;
      this.isDragRef.current = false;

      if (
        (gap <= -MIN_GAP && originPosX !== -(maxPos - IMAGE_WIDTH)) ||
        (MIN_GAP <= gap && originPosX !== 0)
      ) {
        gap > 0
          ? this.changeImagePos(e, IMAGE_WIDTH)
          : this.changeImagePos(e, -IMAGE_WIDTH);
      } else {
        this.resetImagePos(originPosX);
      }
    }
    this.changeFocusIdx();
  };

  focusOut = () => {
    const { originPosX } = this.dragPosRef.current;
    this.isDragRef.current = false;
    this.resetImagePos(originPosX);
  };

  changeImagePos = (e, val = 0) => {
    const { prevPosX } = this.dragPosRef.current;
    const { offsetX: nextPosX } = e.nativeEvent;

    this.dragPosRef.current.originPosX =
      this.dragPosRef.current.originPosX + val;
    this.imgContainerRef.current.style.transform = val
      ? `translateX(${this.dragPosRef.current.originPosX}px)`
      : `translateX(${
          this.dragPosRef.current.originPosX + (nextPosX - prevPosX)
        }px)`;
  };

  resetImagePos = originPosX =>
    (this.imgContainerRef.current.style.transform = `translateX(${originPosX}px)`);

  changeFocusIdx = () =>
    this.setState({
      focusIdx: -this.dragPosRef.current.originPosX / IMAGE_WIDTH,
    });

  imageListClick = idx => {
    this.dragPosRef.current.originPosX = -(IMAGE_WIDTH * idx);
    this.imgContainerRef.current.style.transform = `translateX(${this.dragPosRef.current.originPosX}px)`;
    this.changeFocusIdx();
  };

  render() {
    const { imageList } = this.props;
    const maxPos = IMAGE_WIDTH * imageList.length;

    return (
      <section className="productImages">
        <div className="slide">
          <i
            className="fas fa-chevron-left arrow"
            onClick={e => {
              this.dragPosRef.current.originPosX &&
                this.changeImagePos(e, IMAGE_WIDTH);
              this.changeFocusIdx();
            }}
          ></i>
          <div
            className="imagesWrapper"
            onMouseDown={this.dragStart}
            onMouseMove={this.dragMove}
            onMouseUp={e => this.dragEnd(e, maxPos)}
            onMouseLeave={this.focusOut}
          >
            <div
              className={`imageContainer`}
              ref={this.imgContainerRef}
              style={{
                width: `${maxPos}px`,
              }}
            >
              {imageList.map((image, idx) => {
                return <img src={image} key={idx} alt="temp1" />;
              })}
            </div>
          </div>
          <i
            className="fas fa-chevron-right arrow"
            onClick={e => {
              this.dragPosRef.current.originPosX !== -(maxPos - IMAGE_WIDTH) &&
                this.changeImagePos(e, -IMAGE_WIDTH);
              this.changeFocusIdx();
            }}
          ></i>
        </div>
        <div className="list">
          {imageList.map((image, idx) => {
            return (
              <img
                src={image}
                key={idx}
                alt={image}
                className={this.state.focusIdx === idx ? 'focus' : undefined}
                onClick={() => this.imageListClick(idx)}
              ></img>
            );
          })}
        </div>
      </section>
    );
  }
}

export default ProductImage;
