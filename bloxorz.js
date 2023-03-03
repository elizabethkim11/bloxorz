import {defs, tiny} from './examples/common.js';
import {Tile} from './tile.js';

// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere, Block} = defs;

export class Bloxorz_Base extends Scene {
    curr;
    current;
    constructor() {
        super();
        this.shapes = {
            'block': new Block(),
        }
        const phong = new defs.Phong_Shader();
        this.materials = {
            metal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: color(.9, .5, .9, 1)})
        }
        this.curr = "none";
        this.prev = Mat4.identity();
        this.current = Mat4.identity();
    }
    make_control_panel() {
        this.key_triggered_button("Move block up", ['i'], function () {
            this.curr = "up";
            this.current = this.prev;
        });
        this.key_triggered_button("Move block left", ['j'], function () {
            this.curr = "left";
            this.current = this.prev;
        });
        this.key_triggered_button("Move block down", ['k'], function () {
            this.curr = "down";
            this.current = this.prev;
        });
        this.key_triggered_button("Move block right", ['l'], function () {
            this.curr = "right";
            this.current = this.prev;
        });
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

        // *** Lights: *** Values of vector or point lights.  They'll be consulted by
        // the shader when coloring shapes.  See Light's class definition for inputs.
        const t = this.t = program_state.animation_time / 1000;
        //const angle = Math.sin(t);
        const light_position = vec4(1,1,1,0);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Bloxorz extends Bloxorz_Base {
    draw_block(context, program_state, model_transform, color) {
        const angle = Math.PI/2;
        if (this.curr == "left") {
            console.log("LEFT");
            model_transform = model_transform.times(Mat4.rotation(angle, 0, 0, 1));
            model_transform = model_transform.times(Mat4.translation(-1, -1, 0));
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
            console.log(model_transform);
        }
        else if (this.curr == "right") {
            console.log("RIGHT");
            console.log(model_transform);
            model_transform = model_transform.times(Mat4.rotation(angle, 0, 0, 1));
            model_transform = model_transform.times(Mat4.translation(-1, 1, 0));
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
        }
        else if (this.curr == "up") {
            console.log("UP");
            console.log(model_transform);
            model_transform = model_transform.times(Mat4.rotation(angle, 1, 0, 0));
            model_transform = model_transform.times(Mat4.translation(0, 1, 1));
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
        }
        else if (this.curr == "down") {
            console.log("DOWN");
            console.log(model_transform);
            model_transform = model_transform.times(Mat4.rotation(angle, 1, 0, 0));
            model_transform = model_transform.times(Mat4.translation(0, -1, 1));
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
        }
        else {
                this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
        }
        return model_transform;
    }
    display(context, program_state) {
        super.display(context, program_state);
        const brown = hex_color("#7B3F00")
        console.log(this.prev);
        let model_transform = this.current;
        model_transform = this.draw_block(context, program_state, model_transform, brown);
        this.prev = model_transform;
    }
}