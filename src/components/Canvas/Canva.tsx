import { useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import { useInView } from 'react-intersection-observer';
import { IShader, TTag } from '@/page';

interface IProps {
    props: IShader & { canvaIdx: number; };
}

const Canva = ({ props }: IProps) => {
    const { frag, vert, canvaIdx, tags } = props;
    const canvaRef = useRef<HTMLCanvasElement>(null);
    const { ref, inView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
    });

    const [fragSource, setFragSource] = useState('');
    const [vertSource, setVertSource] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const createShader = (gl, type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const createProgram = (gl, vertexSource, fragmentSource) => {
        const program = gl.createProgram();
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }
        return { program, vertexShader, fragmentShader };
    }

    // Fonction pour initialiser un canvas avec un shader donné
    const setupCanvas = async () => {
        const fragmentSource = (await import(`@/shaders/fragment/${frag}.frag`)).default;
        const vertexSource = (await import(`@/shaders/vertex/${vert}.vert`)).default;
        setFragSource(fragmentSource);
        setVertSource(vertexSource);

        const canvas: HTMLCanvasElement = canvaRef.current;
        const gl = canvas.getContext('webgl');

        const { program, vertexShader, fragmentShader } = createProgram(gl, vertexSource, fragmentSource);
        gl.useProgram(program);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ]), gl.STATIC_DRAW);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, 'u_time');
        let startTime = Date.now();
        const render = () => {
            const currentTime = (Date.now() - startTime) / 1000;
            gl.uniform1f(timeLocation, currentTime);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            const raf = requestAnimationFrame(render);

            return () => {
                cancelAnimationFrame(raf);
            }
        };

        render();
        setIsLoaded(true);

        return () => {
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(buffer);
        }
    }

    const handleCopy = async (content) => {
        try {
            // Utilisation de l'API Clipboard pour copier le texte
            await navigator.clipboard.writeText(content);
            setIsCopied(true);

            // Réinitialisation de l'état après quelques secondes pour indiquer que le texte a été copié
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Échec de la copie dans le presse-papier : ', error);
        }
    };

    useEffect(() => {
        if (!!canvaRef.current) {
            setTimeout(() => {
                setupCanvas();
            }, canvaIdx * 200)
        }
    }, [canvaRef.current, inView])

    return (
        <div className="relative size-full" ref={ref}>
            {inView ?
                <>
                    {!isLoaded && <Loader />}
                    <canvas ref={canvaRef} className={`size-full transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></canvas>
                    {isLoaded &&
                        <>
                            {!!tags &&
                                <div className='absolute left-1 top-1 flex gap-1'>
                                    {tags.map((tag: TTag, ti: number) => (
                                        <span
                                            key={`canva-${canvaIdx}-tag-${ti}`}
                                            className={`rounded-md bg-slate-900/40 px-2 py-1 text-xs text-white`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            }
                            <div className='absolute bottom-0 left-0 flex gap-2'>
                                <button onClick={() => handleCopy(fragSource)} className='bg-slate-900/40 px-2 py-1 text-sm text-white'>Copy fragment</button>
                                <button onClick={() => handleCopy(vertSource)} className='bg-slate-900/40 px-2 py-1 text-sm text-white'>Copy vertex</button>
                            </div>
                            <div className={`${isCopied ? 'opacity-100' : 'opacity-0'} pointer-events-none absolute left-0 top-0 flex size-full items-center justify-center bg-slate-900/60 text-white transition-opacity`}>
                                <p>Copied</p>
                            </div>
                        </>
                    }
                </> : null
            }
        </div>
    )
}

export default Canva;