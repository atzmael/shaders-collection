import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import { useInView } from 'react-intersection-observer';
import { IShader, TTag } from 'interfaces/interfaces';
import useScrollActivity from 'hooks/useScrollActivity';

interface IProps {
    props: IShader & { canvaIdx: number; };
}

const Canva = ({ props }: IProps) => {
    const { frag, vert, canvaIdx, tags } = props;
    const isScrolling = useScrollActivity();
    const { ref, inView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
    });

    const canvaRef = useRef<HTMLCanvasElement>(null);

    const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
    const [program, setProgram] = useState<WebGLProgram | null>(null);
    const animationRef = useRef<number | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [fragSource, setFragSource] = useState('');
    const [vertSource, setVertSource] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [startTime,] = useState(Date.now());

    const createShader = (tmpGl, type, source) => {
        const shader = tmpGl.createShader(type);
        tmpGl.shaderSource(shader, source);
        tmpGl.compileShader(shader);
        if (!tmpGl.getShaderParameter(shader, tmpGl.COMPILE_STATUS)) {
            console.error('Shader compile error:', tmpGl.getShaderInfoLog(shader));
            tmpGl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const createProgram = (tmpGl, vertexSource, fragmentSource) => {
        const program = tmpGl.createProgram();
        const vertexShader = createShader(tmpGl, tmpGl.VERTEX_SHADER, vertexSource);
        const fragmentShader = createShader(tmpGl, tmpGl.FRAGMENT_SHADER, fragmentSource);
        tmpGl.attachShader(program, vertexShader);
        tmpGl.attachShader(program, fragmentShader);
        tmpGl.linkProgram(program);
        if (!tmpGl.getProgramParameter(program, tmpGl.LINK_STATUS)) {
            console.error('Program link error:', tmpGl.getProgramInfoLog(program));
            return null;
        }
        return { tmpProgram: program, vertexShader, fragmentShader };
    }

    // Fonction pour initialiser un canvas avec un shader donné
    const setupCanvas = async () => {
        const fragmentSource = (await import(`@/shaders/fragment/${frag}.frag`)).default;
        const vertexSource = (await import(`@/shaders/vertex/${vert}.vert`)).default;
        setFragSource(fragmentSource);
        setVertSource(vertexSource);

        const canvas: HTMLCanvasElement = canvaRef.current;
        const tmpGl = canvas.getContext('webgl');

        const { tmpProgram } = createProgram(tmpGl, vertexSource, fragmentSource);
        setProgram(tmpProgram);
        tmpGl.useProgram(tmpProgram);

        const positionLocation = tmpGl.getAttribLocation(tmpProgram, "a_position");
        const resolutionLocation = tmpGl.getUniformLocation(tmpProgram, "u_resolution");
        const timeLocation = tmpGl.getUniformLocation(tmpProgram, 'u_time');
        const scrollLocation = tmpGl.getUniformLocation(tmpProgram, 'u_scroll');

        const buffer = tmpGl.createBuffer();
        tmpGl.bindBuffer(tmpGl.ARRAY_BUFFER, buffer);
        tmpGl.bufferData(tmpGl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ]), tmpGl.STATIC_DRAW);

        tmpGl.viewport(0, 0, canvas.width, canvas.height);
        tmpGl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        tmpGl.enableVertexAttribArray(positionLocation);
        tmpGl.vertexAttribPointer(positionLocation, 2, tmpGl.FLOAT, false, 0, 0);

        tmpGl.uniform1f(timeLocation, 0);
        tmpGl.uniform1f(scrollLocation, scrollDirection === 'up' ? 1.0 : -1.0);
        setGl(tmpGl);
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

    const render = useCallback(() => {
        const currentTime = (Date.now() - startTime) / 1000;
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const scrollLocation = gl.getUniformLocation(program, 'u_scroll');
        const scrollDirectionLocation = gl.getUniformLocation(program, 'u_scroll_direction');

        gl.uniform1f(timeLocation, currentTime);
        gl.uniform1f(scrollLocation, scrollPosition);
        gl.uniform1f(scrollDirectionLocation, scrollDirection === 'up' ? 1.0 : -1.0);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }, [scrollPosition, scrollDirection, gl, program, startTime]);

    useEffect(() => {
        if (gl && program) {
            animationRef.current = requestAnimationFrame(render);
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
    }, [gl, program, render]);

    useEffect(() => {
        if (gl && program) {
            setIsLoaded(true);
        }
    }, [gl, program]);

    useEffect(() => {
        if (!!canvaRef.current) {
            setTimeout(() => {
                setupCanvas();
            }, canvaIdx * 200)
        }
    }, [canvaRef.current, inView]);


    useEffect(() => {
        let lastScrollPosition = 0;

        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;

            // Determine direction
            const direction =
                currentScrollPosition > lastScrollPosition ? 'down' : 'up';

            setScrollPosition(currentScrollPosition);
            setScrollDirection(direction);

            // Update last scroll position
            lastScrollPosition = currentScrollPosition;
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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