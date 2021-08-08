import { FaTrash } from "react-icons/fa";

export default function Message({id, author, text, onRemove = f => f}) {

    return (
        <>
            id: {id} - {author}: {text}
            <button onClick={() => onRemove(id)}>
                <FaTrash />
            </button>
        </>
    );
}