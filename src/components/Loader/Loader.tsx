import Triangle from '@/svg/triangle.svg';

interface IProps { }

const Loader = ({ }: IProps) => {
    return (
        <div className='absolute left-1/2 top-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 items-center justify-center'>
            <div className='loader-anim size-[24px]'>
                <Triangle width={24} height={24} />
            </div>
        </div>
    )
}

export default Loader;