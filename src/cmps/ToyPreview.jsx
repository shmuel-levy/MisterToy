export function ToyPreview({ toy }) {
    return (
        <article className="toy-preview">
            <div className="toy-img-container">
                <img src={toy.imgUrl} alt={toy.name} />
            </div>
            <div className="toy-info">
                <h3>{toy.name}</h3>
                <h4 className="price">${toy.price}</h4>
                <p className="stock-status">
                    Status: <span className={toy.inStock ? 'in-stock' : 'out-of-stock'}>
                        {toy.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </p>
                <div className="labels">
                    {toy.labels.map(label => (
                        <span key={label} className="label">{label}</span>
                    ))}
                </div>
            </div>
        </article>
    )
}