import {defs, tiny} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere} = defs;

export class Bloxorz_Base extends Scene {
    constructor() {
        super();
        this.shapes = {
            'block': new Cube(),
        }
        const phong = new defs.Phong_Shader();
        this.materials = {
            metal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: color(.9, .5, .9, 1)})
        }
        this.up = false;
        this.left = false;
        this.down = false;
        this.right = false;
    }
    make_control_panel() {
        this.key_triggered_button("Move block up", ['i'], function () {
            this.up = true;
        });
        this.key_triggered_button("Move block left", ['j'], function () {
            this.left = true;
        });
        this.key_triggered_button("Move block down", ['k'], function () {
            this.down = true;
        });
        this.key_triggered_button("Move block right", ['l'], function () {
            this.right = true;
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
            // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.
            program_state.set_camera(Mat4.translation(0, 0, -20));
            //program_state.set_camera(Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0)));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.  They'll be consulted by
        // the shader when coloring shapes.  See Light's class definition for inputs.
        const t = this.t = program_state.animation_time / 1000;
        const angle = Math.sin(t);
        const light_position = vec4(0, 1, 1, 0);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Bloxorz extends Bloxorz_Base {
    draw_block(context, program_state, model_transform, color) {
        const angle = Math.PI;
        if (this.left) {
            model_transform = model_transform.times(Mat4.rotation(angle, 0, 0, 1));
            model_transform = model_transform.times(Mat4.scale(1, 1.5, 1));
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
            console.log("WORKED");
            console.log(model_transform);
        }
        else {
            model_transform = model_transform.times(Mat4.scale(1, 1.5, 1));
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal.override({color: color}));
        }
        return model_transform;
    }
    display(context, program_state) {
        super.display(context, program_state);
        const brown = hex_color("#7B3F00")
        let model_transform = Mat4.identity();

        for (let i = 0; i < 2; i++) {
            model_transform = this.draw_block(context, program_state, model_transform, brown);
        }
        if (this.left) {
            this.left = false;
        }
    }
}