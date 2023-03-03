import {defs, tiny} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Tiles, Subdivision_Sphere} = defs;

export class Bloxorz_Tile extends Scene {
    constructor() {                  // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape it
        // would be redundant to tell it again.  You should just re-use the
        // one called "box" more than once in display() to draw multiple cubes.
        // Don't define more than one blueprint for the same thing here.
        this.shapes = {
            'tile': new Tiles(),
        };
        const phong = new defs.Phong_Shader();
        this.materials = {
            silver: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("c0c0c0")})
        };
    }


    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(Mat4.translation(0, 3, -10));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.  They'll be consulted by
        // the shader when coloring shapes.  See Light's class definition for inputs.
        const t = this.t = program_state.animation_time / 1000;
        const angle = Math.sin(t);
        const light_position = Mat4.rotation(angle, 1, 0, 0).times(vec4(0, -1, 1, 0));
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}


export class Tile extends Bloxorz_Tile {
    display(context, program_state) {

        super.display(context, program_state);

        const blue = hex_color("#1a9ffa"), yellow = hex_color("#fdc03a")
        // Variable model_transform will be a local matrix value that helps us position shapes.
        // It starts over as the identity every single frame - coordinate axes at the origin.
        let model_transform = Mat4.identity();
        let maxx = 3, maxz = 3;
        for (let i = 0; i < maxz; i++) {
            model_transform = model_transform.times(Mat4.translation(0, 0, -2.02));
            for (let j = 0; j < maxx; j++) {
                model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
                this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
                // model_transform = model_transform.times(Mat4.translation(-2.02, 0, 0));
            }
            model_transform = model_transform.times(Mat4.translation(-2.02 * maxx, 0, 0));

        }

        // model_transform = model_transform.times(Mat4.scale(1, 1, 0.1));
        // Draw a tile:
        // this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        // Tweak our coordinate system downward 2 units for the next shape.
        model_transform = model_transform.times(Mat4.translation(0, -2.02, 0));
        // this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);


        const t = this.t = program_state.animation_time / 1000;


        model_transform = model_transform.times(Mat4.rotation(1, 0, 0, 1))
            .times(Mat4.scale(1, 2, 1))
            .times(Mat4.translation(0, -1.5, 0));
        // Draw the bottom (child) box:
        // this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic.override(yellow));
    }
}