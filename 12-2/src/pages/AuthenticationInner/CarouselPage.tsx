const CarouselPage = () => {
  return (
    <div className="col-xxl-9 col-lg-8 col-md-7">
      <div className="auth-bg bg-primary pt-md-5 p-4 d-flex">
        <div className="bg-overlay"></div>
        <ul className="bg-bubbles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="row justify-content-center align-items-center">
          <div className="col-xl-7">
            <div className="p-0 p-sm-4 px-xl-0">
              <div
                id="reviewcarouselIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                {/* <Carousel
                  activeIndex={activeIndex}
                  next={next}
                  previous={previous}
                >
                  {slides}
                  <CarouselIndicators
                    items={items}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                  />
                </Carousel> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselPage;
