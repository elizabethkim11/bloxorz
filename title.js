import {defs, tiny} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere, Block, Tiles, Textured_Phong} = defs;

export class Title extends Scene {
    curr;
    current;
    constructor() {
        super();
        this.shapes = {
            'block': new Block(),
            'square': new Square()
        }
        const phong = new defs.Phong_Shader();
        const textured = new defs.Textured_Phong(1);
        this.materials = {
            //metal: new Material(textured, {
            //  ambient: .9, diffusivity: .8, specularity: .8, texture: new Texture('assets/brick.png')}),
            metal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("7B3F00")}),
            title: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/bloxorz.png", "LINEAR_MIPMAP_LINEAR")
            }),
        }
    }
    make_control_panel() {
        this.key_triggered_button("Start game from beginning", ['Enter'], function () {
            console.log("hi");
        });
        this.key_triggered_button("Move block up", ['i'], function () {
        });
        this.key_triggered_button("Move block left", ['j'], function () {
        });
        this.key_triggered_button("Move block down", ['k'], function () {
        });
        this.key_triggered_button("Move block right", ['l'], function () {
        });
        this.new_line();
        this.new_line();
        this.control_panel.innerHTML += "Press enter to begin the game";

    }
    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());

            // Set camera position and target position
            const camera_position = vec3(10, 2, -18);
            const target_position = vec3(8.5, 0, 0);
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
        const light_position = vec4(1,1,1,0);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        let square_transform = Mat4.identity();
        let T1 =  Mat4.translation(10.5, 1, 0);
        let S1 =  Mat4.scale(7.5, 7.5, 0);
        square_transform = square_transform.times(T1).times(S1);

        this.shapes.block.draw(context, program_state, Mat4.identity(), this.materials.metal);
        this.shapes.square.draw(context, program_state, square_transform, this.materials.title);
    }
}