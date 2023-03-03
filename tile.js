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
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("c0c0c0")}),
            goal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("abd7eb")})
        };
    }


    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());

            // Define the global camera and projection matrices, which are stored in program_state.  The camera
            // matrix follows the usual format for transforms, but with opposite values (cameras exist as
            // inverted matrices).  The projection matrix follows an unusual format and determines how depth is
            // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
            // orthographic() automatically generate valid matrices for one.  The input arguments of
            // Set camera position and target position
            const camera_position = vec3(10, 10, -15);
            const target_position = vec3(0, 0, 0);
            const up_vector = vec3(0, 1, 0);

            // Create the camera matrix using the look_at function
            const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

            // Set the camera matrix in the program state
            program_state.set_camera(camera_matrix);
            // program_state.set_camera(Mat4.translation(0, 0, -25));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const t = this.t = program_state.animation_time / 1000;
        const angle = Math.sin(t);
        const light_position = Mat4.rotation(angle, 1, 0, 0).times(vec4(0, -1, 1, 0));
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}


export class Tile extends Bloxorz_Tile {
    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());

            // Define the global camera and projection matrices, which are stored in program_state.  The camera
            // matrix follows the usual format for transforms, but with opposite values (cameras exist as
            // inverted matrices).  The projection matrix follows an unusual format and determines how depth is
            // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
            // orthographic() automatically generate valid matrices for one.  The input arguments of
            // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.
            // Set camera position and target position
            const camera_position = vec3(10, 10, -15);
            const target_position = vec3(0, 0, 0);
            const up_vector = vec3(0, 1, 0);

            // Create the camera matrix using the look_at function
            const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

            // Set the camera matrix in the program state
            program_state.set_camera(camera_matrix);
            // program_state.set_camera(Mat4.translation(0, 0, -25));
        }
        super.display(context, program_state);

        const blue = hex_color("#1a9ffa"), yellow = hex_color("#fdc03a")
        // Variable model_transform will be a local matrix value that helps us position shapes.
        // It starts over as the identity every single frame - coordinate axes at the origin.
        let model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(-15, -3, 0));
        let maxx = 3, maxz = 3;
        // for (let i = 0; i < maxz; i++) {
        //     model_transform = model_transform.times(Mat4.translation(0, 0, -2.02));
        //     for (let j = 0; j < maxx; j++) {
        //         model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
        //         this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        //         // model_transform = model_transform.times(Mat4.translation(-2.02, 0, 0));
        //     }
        //     model_transform = model_transform.times(Mat4.translation(-2.02 * maxx, 0, 0));
        //
        // }
        for (let i = 0; i < 3; i++) {
            model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        }
        model_transform = model_transform.times(Mat4.translation(-2.02 * 3, 0, 0));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 6; i++) {
            model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        }
        model_transform = model_transform.times(Mat4.translation(-2.02 * 6, 0, 0));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        }
        model_transform = model_transform.times(Mat4.translation(-2.02 * 8, 0, 0));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        }
        model_transform = model_transform.times(Mat4.translation(-2.02 * 5, 0, 0));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 5; i++) {
            model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
            if (i == 2) {
                this.shapes.tile.draw(context, program_state, model_transform, this.materials.goal);
            } else {
                this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
            }
        }
        model_transform = model_transform.times(Mat4.translation(-2.02 * 4, 0, 0));
        model_transform = model_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 3; i++) {
            model_transform = model_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
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