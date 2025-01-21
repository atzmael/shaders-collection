export const tags = ['all', 'interactive', 'animated', 'fragment', 'vertex'] as const;
export type TTag = typeof tags[number];

export interface IShader {
    name: string;
    frag: string;
    vert: string;
    createdAt: string;
    tags?: TTag[];
}