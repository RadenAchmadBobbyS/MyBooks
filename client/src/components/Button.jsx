export default function Button(props) {
    const { onClick, type = "button", title, variant = "neutral" } = props
  
    const variantClass = `btn-${variant}`
  
    return (
      <button onClick={onClick} type={type} className={`btn ${variantClass}`}>
        {title}
      </button>
    );
  }