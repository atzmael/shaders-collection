'use client'

import Canva from '@/components/Canvas/Canva';
import AddShader from '@/components/Form/AddShader/AddShader';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { IShader, tags, TTag } from 'interfaces/interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedItem, setSelectedItem] = useState(null);
	const [showCode, setShowCode] = useState(false);
	const [filter, setFilter] = useState<TTag>(searchParams.get('filter') ? searchParams.get('filter') as TTag : 'all');
	const [searchItem, setSearchItem] = useState('');
	const [addUserModal, setAddUserModal] = useState(false);
	const [list, setList] = useState<IShader[] | null>(null);

	const getFilteredShaders = () => {
		if (!list) return [];
		if (filter === 'all') {
			return list;
		}
		return list.filter((shader) => shader.tags?.includes(filter));
	}

	const handleInputChange = (e) => {
		const searchTerm = e.target.value;
		setSearchItem(searchTerm)
	}

	const filterShaders = (filter: TTag) => {
		router.push('?filter=' + filter);
		setFilter(filter);
	}

	const retrieveShaders = async () => {
		const response = await fetch('/api/get-shaders');
		const data = await response.json();
		setList(data.data.reverse());
		if (process.env.NODE_ENV === 'development') {
			console.log("data", data.data);
		}
	}

	useEffect(() => {
		const filter = searchParams.get('filter');
		if (filter) {
			setFilter(filter as TTag);
		}
	}, [searchParams])

	useEffect(() => {
		if (!addUserModal && list !== null) {
			retrieveShaders();
		}
	}, [addUserModal])

	useEffect(() => {
		retrieveShaders();
	}, [])

	return (
		<div className='relative mx-auto my-4 w-full max-w-[960px]'>
			<div className='withBorder rounded-md px-6 py-4 shadow'>
				<h1 className='text-xl font-bold'>Shaders collection</h1>
				<p>Feel free to use them anywhere, anytime.</p>
				<p>If you use them, I would love to see how and where ! Please send me a message on <a href={"https://www.linkedin.com/in/maelatzmal/"}>linkedin</a> with your project <span className='fa fa-heart'></span></p>
				<p>Made over time by&nbsp;<a href={"https://www.linkedin.com/in/maelatzmal/"}>Maël, a french developer, updated as soon as I create a new one (last update {!!list && new Date(list[0].createdAt).toLocaleDateString()})</a></p>
			</div>

			{/* <div className={`withBorder mt-4 w-full rounded-md px-6 py-4 shadow`}>
				<input
					type="text"
					value={searchItem}
					onChange={handleInputChange}
					placeholder='Type to search'
					className='withBorder bg-dark rounded-md px-2 py-1'
				/>
			</div> */}

			<div className={`withBorder mt-4 w-full rounded-md p-4 shadow`}>
				<div className='flex gap-2 px-2'>
					<span className='py-1'>Filter by tags</span>
					{tags.map((tag: TTag, ti: number) => (
						<button
							key={`tag-${ti}`}
							onClick={() => filterShaders(tag)}
							className={`filterTag rounded-md ${tag == filter ? 'active' : ''} px-2 py-1`}>
							{tag}
						</button>
					))}
				</div>
				{!!list && <p className='mt-2 px-2 text-sm italic'>{getFilteredShaders().length} shader{getFilteredShaders().length > 1 ? 's' : ''} found</p>}
				<div className='mt-2 flex flex-wrap'>
					{getFilteredShaders().map((props: IShader, li: number) => (
						<div key={`canva-${li}`} className='aspect-square w-1/3 p-2'>
							<Canva props={{ ...props, canvaIdx: li }} />
						</div>
					))}
				</div>
			</div>

			{!!selectedItem &&
				<div className='fixed left-0 top-0 z-50 size-full bg-slate-900'>
					<div className='absolute right-2 top-2 flex gap-2'>
						<button className='rounded-md bg-white p-2 shadow-md' onClick={() => setShowCode(!showCode)}>{!!showCode && 'x'} Show code</button>
						<button className='rounded-md bg-white p-2 shadow-md' onClick={() => setSelectedItem(null)}>Close</button>
					</div>
					<div>
					</div>
				</div>
			}

			<ThemeToggle />

			{process.env.NODE_ENV === 'development' &&
				<>
					<div className='fixed bottom-2 left-2 '>
						<button onClick={() => setAddUserModal(true)} className='rounded-md bg-white p-2 text-slate-900'>Add shader</button>
					</div>
					{addUserModal && <AddShader setAddUserModal={setAddUserModal} />}
				</>
			}
		</div>
	)
}
