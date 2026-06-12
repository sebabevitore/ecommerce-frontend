
import '../style/CategoryList.css';


const CategoryList = ({ categories, onCategorySelect, selectedCategory }) => {

    return (
        <aside className="sidebar">
            <h3>Categorías</h3>
            <ul className="category-list">
                <li 
                    className={`category-all ${!selectedCategory ? 'active' : ''}`} 
                    onClick={() => onCategorySelect(null)}
                >
                    Todos los productos
                </li>

                {categories.map(cat => (
                <li 
                    key={cat.id} 
                    className={selectedCategory === cat.id ? 'active' : ''}
                    onClick={() => onCategorySelect(cat.id)}
                >
                    {cat.nombre}
                </li>
                ))}

            </ul>
        </aside>

    )


}

export default CategoryList;