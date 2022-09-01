import { Square } from "phosphor-react"

export default function ColorButton({ color, setSelectedNewColor, setColorMenuOpened }) {
    return (
        <button onClick={() => {
            setSelectedNewColor(color);
            setColorMenuOpened(false);
        }}>
            <Square size={36} color={color} weight="fill" />
        </button>
    )
}