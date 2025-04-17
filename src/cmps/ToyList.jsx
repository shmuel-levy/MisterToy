import { ToyPreview } from './ToyPreview.jsx';

export function ToyList({ toys }) {
    if (!toys || !toys.length) {
        return <div className="empty-list">No toys to show</div>;
    }
    
    return (
        <section className="toy-list">
            {toys.map(toy => (
                <ToyPreview 
                    key={toy._id} 
                    toy={toy} 
                />
            ))}
        </section>
    );
}