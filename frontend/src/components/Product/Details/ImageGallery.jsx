import React, { Component } from "react";

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.thumbnailsRef = React.createRef();
    this.isDragging = false;
    this.startY = 0;
    this.scrollTop = 0;
  }

  componentDidUpdate(prevProps) {
    const { currentImageIndex } = this.props;

    if (
      prevProps.currentImageIndex !== currentImageIndex &&
      this.thumbnailsRef.current
    ) {
      const activeThumbnail =
        this.thumbnailsRef.current.querySelector(".active-thumbnail");
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }

  handleMouseDown = (e) => {
    this.isDragging = true;
    this.startY = e.clientY;
    this.scrollTop = this.thumbnailsRef.current.scrollTop;
  };

  handleMouseMove = (e) => {
    if (!this.isDragging) return;
    const dy = e.clientY - this.startY;
    this.thumbnailsRef.current.scrollTop = this.scrollTop - dy;
  };

  handleMouseUp = () => {
    this.isDragging = false;
  };

  render() {
    const { gallery, currentImageIndex, handleImageChange } = this.props;

    return (
      <div className="product-gallery" data-testid="product-gallery">
        <div
          className="gallery-thumbnails"
          ref={this.thumbnailsRef}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseUp}
        >
          {gallery.map((image, index) => (
            <img
              key={`gallery-${index}`}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={index === currentImageIndex ? "active-thumbnail" : ""}
              onClick={() => handleImageChange(index)}
            />
          ))}
        </div>
        <div className="main-image-container">
          <img src={gallery[currentImageIndex]} alt="Main" />
          <div className="image-navigation">
            <button
              onClick={() =>
                handleImageChange(
                  (currentImageIndex - 1 + gallery.length) % gallery.length
                )
              }
            >
              &lt;
            </button>
            <button
              onClick={() =>
                handleImageChange((currentImageIndex + 1) % gallery.length)
              }
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageGallery;
