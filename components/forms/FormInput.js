export default function FormInput({text, onChange, type='text'}) {
    return (
        <input 
            className="w-56 p-2 rounded-md mb-5 border-2 focus:outline-none focus:border-blue"
            type={type}
            placeholder={text} 
            aria-label={text}
            onChange={e => onChange(e)} 
        />
    )
}