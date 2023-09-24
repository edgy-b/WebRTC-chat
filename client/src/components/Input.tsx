import { ChangeEvent } from 'react';

interface Props {
    value: string;
    callback: React.Dispatch<React.SetStateAction<string>>;
    inputType: string;
    name: string;
    label: string;
    placeholder?: string;
    className?: string;
}

const Input: React.FC<Props> = ({ value, callback, inputType, name, label, placeholder, className }) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        callback(event.target.value)
    }

    const classes = `${className} grid grid-cols-2`;

    return (
        <div className={ classes }>
            <label htmlFor={ name } className="flex items-center text-slate-200">
                { label }
            </label>
            <input
              id={ name }
              name={ name }
              type={ inputType }
              value={ value }
              onChange={ handleChange }
              placeholder={ placeholder }
              className="rounded-lg border border-solid p-1"
            />
        </div>
        
    );
}

export default Input;

