export function About() {
    return (
      <section className="about">
        <h1>About Mister Toy</h1>
        <div className="about-content">
          <div className="about-image">
            <img src="https://via.placeholder.com/400x300?text=Our+Store" alt="Our Store" />
          </div>
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              Mister Toy was founded in 2010 with a simple mission: to bring joy to children and adults alike through high-quality toys.
            </p>
            <p>
              What started as a small store has grown into a beloved toy shop with a wide selection of toys for all ages.
            </p>
            <h2>Our Values</h2>
            <ul>
              <li>Quality over quantity</li>
              <li>Customer satisfaction</li>
              <li>Creating memorable experiences</li>
              <li>Supporting local toy makers</li>
            </ul>
          </div>
        </div>
      </section>
    )
  }