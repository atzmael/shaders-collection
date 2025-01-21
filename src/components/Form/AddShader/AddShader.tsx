import { tags, TTag } from "interfaces/interfaces";
import { ChangeEvent, Dispatch, useState } from "react";

interface IProps {
    setAddUserModal: Dispatch<React.SetStateAction<boolean>>
}

const AddShader = ({ setAddUserModal }: IProps) => {

    const [formData, setFormData] = useState({
        name: '',
        frag: '',
        vert: '',
        tags: [],
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'select-multiple') {
            /* @ts-ignore */
            const options = e.target.options;
            const selectedOptions = Array.from(options)
                .filter((option: HTMLOptionElement) => option.selected)
                .map((option: HTMLOptionElement) => option.value);
            setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch('/api/add-shader', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, createdAt: new Date() }),
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            console.log("Shader added");
            setFormData({
                name: '',
                frag: '',
                vert: '',
                tags: [],
            })
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 p-4 text-white">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-2 block" htmlFor="name">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 p-2 text-slate-900"
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block" htmlFor="email">
                        Frag shader:
                    </label>
                    <input
                        type="text"
                        id="frag"
                        name="frag"
                        value={formData.frag}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 p-2 text-slate-900"
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block" htmlFor="age">
                        Vert shader:
                    </label>
                    <input
                        type="text"
                        id="vert"
                        name="vert"
                        value={formData.vert}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 p-2 text-slate-900"
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block" htmlFor="hobbies">
                        Tags:
                    </label>
                    <select
                        id="tags"
                        name="tags"
                        multiple
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 p-2 text-slate-900"
                    >
                        {tags.filter((tag: TTag) => tag !== 'all').map((tag: TTag, ti: number) => (
                            <option
                                key={`option-tag-${ti}`}
                                className="text-slate-900"
                            >
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                    Save as JSON
                </button>
                <button
                    type="button"
                    className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                    onClick={() => setAddUserModal(false)}
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default AddShader;