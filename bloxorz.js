import {defs, tiny} from './examples/common.js';
import {Tile} from './tile.js';

// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere, Block, Tiles, Textured_Phong} = defs;

export class Bloxorz_Base extends Scene {
    curr;
    current;
    constructor() {
        super();
        this.shapes = {
            'block': new Block(),
            'tile': new Tiles(),
        }
        const phong = new defs.Phong_Shader();
        const textured = new defs.Textured_Phong(1);
        this.materials = {
            //metal: new Material(textured, {
              //  ambient: .9, diffusivity: .8, specularity: .8, texture: new Texture('assets/brick.png')}),
            metal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("7B3F00")}),
            silver: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("c0c0c0")}),
            goal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("abd7eb")})
        }
        this.curr = "none";
        this.curr_pos = "upright";
        this.prev = Mat4.identity();
        this.current = Mat4.identity();
        this.count = 0;
        this.prev_pos = "upright";
        this.cube_position = vec3(0, 0, 0);
        this.goal_position = vec3(0, 0, 0);
    }
    make_control_panel() {
        this.key_triggered_button("Move block up", ['i'], function () {
            this.curr = "up";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
            } else if (this.prev_pos == "sideways") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
            } else {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
            }
            this.count += 1;
        });
        this.key_triggered_button("Move block left", ['j'], function () {
            this.curr = "left";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
            } else if (this.prev_pos == "lying") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
            } else {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
            }
            this.count += 1;
        });
        this.key_triggered_button("Move block down", ['k'], function () {
            this.curr = "down";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
            } else if (this.prev_pos == "sideways") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
            } else {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
            }
            this.count += 1;
        });
        this.key_triggered_button("Move block right", ['l'], function () {
            this.curr = "right";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
            } else if (this.prev_pos == "lying") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
            } else {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
            }
            this.count += 1;
        });
        this.new_line();
        this.new_line();
        this.control_panel.innerHTML += "Count: ";
        this.live_string(box => {
            box.textContent = this.count + " moves"
        });

    }
    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());

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
        const light_position = vec4(1,1,1,0);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Bloxorz extends Bloxorz_Base {
    draw_block(context, program_state, model_transform, color) {
        const angle = Math.PI/2;
        if (this.curr == "left") {
            //console.log(this.shapes.block.position);
            console.log("LEFT");
            console.log(this.curr_pos);
            if (this.curr_pos == "upright") {
                model_transform = model_transform.times(Mat4.rotation(angle, 0, 0, 1)).times((Mat4.translation(3, 1, 0)));
            } else if (this.curr_pos == "sideways") {
                model_transform = model_transform.times(Mat4.translation(2, 0, 0));
            } else {
                model_transform = model_transform.times(Mat4.rotation(angle*3, 0, 0, 1)).times((Mat4.translation(1, 3, 0)));
            }
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal);
            console.log(model_transform);
        }
        else if (this.curr == "right") {
            console.log("RIGHT");
            console.log(model_transform);
            console.log(this.curr_pos);
            if (this.curr_pos == "upright") {
                model_transform = model_transform.times(Mat4.rotation(angle, 0, 0, 1)).times((Mat4.translation(-3, 1, 0)));
            } else if (this.curr_pos == "sideways") {
                model_transform = model_transform.times(Mat4.translation(-2, 0, 0));
            } else {
                model_transform = model_transform.times(Mat4.rotation(angle*3, 0, 0, 1)).times((Mat4.translation(1, -3, 0)));
            }
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal);
        }
        else if (this.curr == "up") {
            console.log("UP");
            console.log(model_transform);
            console.log(this.curr_pos);
            if (this.curr_pos == "upright") {
                model_transform = model_transform.times(Mat4.rotation(angle, 1, 0, 0)).times((Mat4.translation(0, 1, 3)));
            } else if (this.curr_pos == "sideways") {
                model_transform = model_transform.times(Mat4.rotation(angle*3, 1, 0, 0)).times((Mat4.translation(0, -3, -1)));
            } else {
                model_transform = model_transform.times(Mat4.translation(0, 0, 2));
            }
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal);
        }
        else if (this.curr == "down") {
            console.log("DOWN");
            console.log(model_transform);
            console.log(this.curr_pos);
            if (this.curr_pos == "upright") {
                model_transform = model_transform.times(Mat4.rotation(angle, 1, 0, 0)).times((Mat4.translation(0, 1, -3)));
            } else if (this.curr_pos == "sideways") {
                model_transform = model_transform.times(Mat4.rotation(angle*3, 1, 0, 0)).times((Mat4.translation(0, 3, -1)));
            } else {
                model_transform = model_transform.times(Mat4.translation(0, 0, -2));
            }
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal);
        }
        else {
                this.shapes.block.draw(context, program_state, model_transform, this.materials.metal);
        }
        return model_transform;
    }
    draw_tile_platform1(context, program_state, tiles_transform) {
        tiles_transform = tiles_transform.times(Mat4.translation(-12, -2, -2));
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
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 3, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 6; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 6, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 8, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 5, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 5; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            if (i == 2) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.goal);
            } else {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 4, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 3; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }


        // model_transform = model_transform.times(Mat4.scale(1, 1, 0.1));
        // Draw a tile:
        // this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);
        // Tweak our coordinate system downward 2 units for the next shape.
        tiles_transform = tiles_transform.times(Mat4.translation(0, -2.02, 0));
        // this.shapes.tile.draw(context, program_state, model_transform, this.materials.silver);


        const t = this.t = program_state.animation_time / 1000;


        tiles_transform = tiles_transform.times(Mat4.rotation(1, 0, 0, 1))
            .times(Mat4.scale(1, 2, 1))
            .times(Mat4.translation(0, -1.5, 0));
        return tiles_transform;

    }
    display(context, program_state) {
        super.display(context, program_state);
        const brown = hex_color("#7B3F00")
        let model_transform = this.current;
        model_transform = this.draw_block(context, program_state, model_transform, brown);
        this.prev = model_transform;
        if (this.curr == "up" && this.curr_pos == "upright") {
            this.cube_position[1] += 2;
        } else if (this.curr == "down" && this.curr_pos == "upright") {
            this.cube_position[1] -= 2;
        } else if (this.curr == "up" && this.curr_pos == "sideways") {
            this.cube_position[1] += 2;
        } else if (this.curr == "down" && this.curr_pos == "sideways") {
            this.cube_position[1] -= 2;
        } else if (this.curr == "up" && this.curr_pos == "lying") {
            this.cube_position[1] += 1;
        } else if (this.curr == "down" && this.curr_pos == "lying") {
            this.cube_position[1] -= 1;
        } else if (this.curr == "right" && this.curr_pos == "sideways") {
            this.cube_position[0] += 1;
        } else if (this.curr == "left" && this.curr_pos == "sideways") {
            this.cube_position[0] -= 1;
        } else if (this.curr == "right" && this.curr_pos == "upright") {
            this.cube_position[0] += 2;
        } else if (this.curr == "left" && this.curr_pos == "upright") {
            this.cube_position[0] -= 2;
        } else if (this.curr == "right" && this.curr_pos == "lying") {
            this.cube_position[0] += 1;
        } else if (this.curr == "left" && this.curr_pos == "lying") {
            this.cube_position[0] -= 1;
        }
        console.log(this.cube_position);

        // TILES PLATFORM
        let tiles_transform = Mat4.identity();
        tiles_transform = this.draw_tile_platform1(context, program_state, tiles_transform);

    }
}