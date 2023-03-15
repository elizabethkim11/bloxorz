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
            'square': new Square()
        }
        const phong = new defs.Phong_Shader();
        const textured = new defs.Textured_Phong(1);
        this.materials = {
           // metal: new Material(textured, {
            //   ambient: .9, diffusivity: .8, specularity: .8, texture: new Texture('assets/brick.png')}),
            metal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("7B3F00")}),
            silver: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("c0c0c0")}),
            goal: new Material(phong,
                {ambient: .2, diffusivity: .8, specularity: .8, color: hex_color("abd7eb")}),
            level1: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/level1.png", "LINEAR_MIPMAP_LINEAR")
            }),
            level2: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/level2.png", "LINEAR_MIPMAP_LINEAR")
            }),
            level3: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/level3.png", "LINEAR_MIPMAP_LINEAR")
            }),
            level4: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/level4.png", "LINEAR_MIPMAP_LINEAR")
            }),
            level5: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/level5.png", "LINEAR_MIPMAP_LINEAR")
            }),
            title: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/bloxorz.png", "LINEAR_MIPMAP_LINEAR")
            }),
            win: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/win.png", "LINEAR_MIPMAP_LINEAR")
            }),
            restart: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/restart.png", "LINEAR_MIPMAP_LINEAR")
            })
        }
        this.curr = "none";
        this.curr_pos = "upright";
        this.prev = Mat4.identity();
        this.current = Mat4.identity();
        this.count = 0;
        this.prev_pos = "upright";
        this.cube_1_position = vec3(0, 0,0);
        this.cube_2_position= vec3(0,0,0);
        this.goal_position = vec3(-2, 3, 0);
        this.background_music = new Audio('assets/background_music.mp3');
        this.bg_music = false;
    }
    make_control_panel() {
        this.key_triggered_button("Start game from beginning", ['Enter'], function () {
            this.i = 1;
            this.curr = "none";
            this.curr_pos = "upright";
            this.prev = Mat4.identity();
            this.current = Mat4.identity();
            this.count = 0;
            this.prev_pos = "upright";
            this.cube_1_position = vec3(0, 0,0);
            this.cube_2_position= vec3(0,0,0);
            this.goal_position = vec3(-2, 3, 0);
        });
        this.key_triggered_button("Move block up", ['i'], function () {
            this.curr = "up";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
                this.cube_1_position[1] += 2;
                this.cube_2_position[1] += 1;
            } else if (this.prev_pos == "sideways") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
                if (this.cube_1_position[1] > this.cube_2_position[1]) {
                    this.cube_1_position[1] += 1;
                    this.cube_2_position[1] += 2;
                }
                else {
                    this.cube_2_position[1] += 1;
                    this.cube_1_position[1] += 2;
                }
            } else {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
                this.cube_1_position[1] += 1;
                this.cube_2_position[1] += 1;
            }
            this.count += 1;
        });
        this.key_triggered_button("Move block left", ['j'], function () {
            this.curr = "left";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
                this.cube_1_position[0] -= 2;
                this.cube_2_position[0] -= 1;

            } else if (this.prev_pos == "lying") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
                if (this.cube_1_position[0] < this.cube_2_position[0]) {
                    this.cube_1_position[0] -= 1;
                    this.cube_2_position[0] -= 2;
                }
                else {
                    this.cube_2_position[0] -= 1;
                    this.cube_1_position[0] -= 2;
                }
            } else {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
                this.cube_1_position[0] -= 1;
                this.cube_2_position[0] -= 1;
            }
            this.count += 1;
        });
        this.key_triggered_button("Move block down", ['k'], function () {
            this.curr = "down";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
                this.cube_1_position[1] -= 2;
                this.cube_2_position[1] -= 1;

            } else if (this.prev_pos == "sideways") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
                if (this.cube_1_position[1] < this.cube_2_position[1]) {
                    this.cube_2_position[1] -= 2;
                    this.cube_1_position[1] -= 1;
                }
                else {
                    this.cube_1_position[1] -= 2;
                    this.cube_2_position[1] -= 1;
                }
            } else {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
                this.cube_1_position[1] -= 1;
                this.cube_2_position[1] -= 1;
            }
            this.count += 1;
        });
        this.key_triggered_button("Move block right", ['l'], function () {
            this.curr = "right";
            this.current = this.prev;
            if (this.prev_pos == "upright") {
                this.curr_pos = "lying";
                this.prev_pos = "lying";
                this.cube_2_position[0] += 1;
                this.cube_1_position[0] += 2;
            } else if (this.prev_pos == "lying") {
                this.curr_pos = "upright";
                this.prev_pos = "upright";
                if (this.cube_1_position[0] > this.cube_2_position[0]) {
                    this.cube_1_position[0] += 1;
                    this.cube_2_position[0] += 2;
                }
                else {
                    this.cube_2_position[0] += 1;
                    this.cube_1_position[0] += 2;
                }
            } else {
                this.curr_pos = "sideways";
                this.prev_pos = "sideways";
                this.cube_1_position[0] += 1;
                this.cube_2_position[0] += 1;
            }
            this.count += 1;
        });
        this.new_line();
        this.new_line();
        this.key_triggered_button("Music On/Off", ["m"], () => { this.bg_music = !this.bg_music });
        this.new_line();
        this.new_line();
        this.control_panel.innerHTML += "Count: ";
        this.live_string(box => {
            box.textContent = this.count + " moves"
        });

    }
    display(context, program_state) {
        // Set camera position and target position
        const camera_position = vec3(10, 10, -15);
        const target_position = vec3(0, 0, 0);
        const up_vector = vec3(0, 1, 0);

        // Create the camera matrix using the look_at function
        const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

        // Set the camera matrix in the program state
        program_state.set_camera(camera_matrix);
        // program_state.set_camera(Mat4.translation(0, 0, -25));

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
    i = 0;
    next_stage() {
        this.curr = "none";
        this.curr_pos = "upright";
        this.prev = Mat4.identity();
        this.current = Mat4.identity();
        this.count = 0;
        this.prev_pos = "upright";
        this.cube_1_position = vec3(0, 0,0);
        this.cube_2_position= vec3(0,0,0);
    }
    draw_block(context, program_state, model_transform, color) {
        const angle = Math.PI/2;
        if (this.curr == "left") {
            //console.log(this.shapes.block.position);
            //console.log("LEFT");
            //console.log(this.curr_pos);
            if (this.curr_pos == "upright") {
                model_transform = model_transform.times(Mat4.rotation(angle, 0, 0, 1)).times((Mat4.translation(3, 1, 0)));
            } else if (this.curr_pos == "sideways") {
                model_transform = model_transform.times(Mat4.translation(2, 0, 0));
            } else {
                model_transform = model_transform.times(Mat4.rotation(angle*3, 0, 0, 1)).times((Mat4.translation(1, 3, 0)));
            }
            this.shapes.block.draw(context, program_state, model_transform, this.materials.metal);
            //console.log(model_transform);
        }
        else if (this.curr == "right") {
            //console.log("RIGHT");
            //console.log(model_transform);
            //console.log(this.curr_pos);
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
            //console.log("UP");
            //console.log(model_transform);
            //console.log(this.curr_pos);
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
            //console.log("DOWN");
            //console.log(model_transform);
            //console.log(this.curr_pos);
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
        this.goal_position = vec3(-2, 3, 0);
        tiles_transform = tiles_transform.times(Mat4.translation(-12, -2, -2));
        let maxx = 3, maxz = 3;
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
    draw_tile_platform2(context, program_state, tiles_transform) {
        this.goal_position = vec3(-6, 4, 0);
        tiles_transform = tiles_transform.times(Mat4.translation(-12, -2, -2));
        let maxx = 3, maxz = 3;
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 8, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 5; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 6, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 8, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 6; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 5, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 8; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);

        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 4, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 6; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            if (i == 5) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.goal);
            } else {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
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
    draw_tile_platform3(context, program_state, tiles_transform) {
        this.goal_position = vec3(-4,  1, 0);
        tiles_transform = tiles_transform.times(Mat4.translation(-12, -2, -2));
        let maxx = 3, maxz = 3;
        for (let i = 0; i < 3; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            if (i != 1) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 6, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(6.0, 0, 2.02));
        for (let i = 0; i < 7; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            if (i != 4) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 6, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            if (i == 8) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.goal);
            } else if (i != 7 && i != 3) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 8, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            if (i != 5) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 5, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 5; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
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
    draw_tile_platform4(context, program_state, tiles_transform) {
        this.goal_position = vec3(6, 3, 0);
        tiles_transform = tiles_transform.times(Mat4.translation(-8, -2, -2));
        for (let i = 0; i < 4; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0*4, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 6; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 4, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 6; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 4, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 10; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(-2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
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
    draw_tile_platform5(context, program_state, tiles_transform) {
        this.goal_position = vec3(0, 3, 0);
        tiles_transform = tiles_transform.times(Mat4.translation(-12, -2, -2));
        let maxx = 3, maxz = 3;
        for (let i = 0; i < 10; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.0 * 6, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
        this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        for (let i = 0; i < 7; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.0, 0, 0));
            if (i != 1 && i != 2) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
        this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 12, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 11; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            if (i != 2 && i != 3 ) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 6, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 9; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            if (i != 1) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 10, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        for (let i = 0; i < 7; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            if (i == 0) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.goal);
            } else if (i != 4) {
                this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
            }
        }
        tiles_transform = tiles_transform.times(Mat4.translation(-2.02 * 4, 0, 0));
        tiles_transform = tiles_transform.times(Mat4.translation(0, 0, 2.02));
        this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        for (let i = 0; i < 5; i++) {
            tiles_transform = tiles_transform.times(Mat4.translation(2.02, 0, 0));
            this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);
        }
        this.shapes.tile.draw(context, program_state, tiles_transform, this.materials.silver);


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
    select_tile(context, program_state, tiles_transform, index) {
        if (index == 1) {
            this.draw_tile_platform1(context, program_state, tiles_transform);
        }
        else if (index == 2) {
            this.draw_tile_platform2(context, program_state, tiles_transform);
        }
        else if (index == 3) {
            this.draw_tile_platform3(context, program_state, tiles_transform);
        }
        else if (index == 4) {
            this.draw_tile_platform4(context, program_state, tiles_transform);
        }
        else if (index == 5) {
            this.draw_tile_platform5(context, program_state, tiles_transform);
        }
    }
    select_level(context, program_state, level_transform, index) {
        if (index == 1) {
            this.shapes.square.draw(context, program_state, level_transform, this.materials.level1);
        }
        else if (index == 2) {
            this.shapes.square.draw(context, program_state, level_transform, this.materials.level2);
        }
        else if (index == 3) {
            this.shapes.square.draw(context, program_state, level_transform, this.materials.level3);
        }
        else if (index == 4) {
            this.shapes.square.draw(context, program_state, level_transform, this.materials.level4);
        }
        else if (index == 5) {
            this.shapes.square.draw(context, program_state, level_transform, this.materials.level5);
        }
    }
    check_boundaries(index) {
        // index = level number
        if (index == 1) {
            return [[0,-1], [1,-1], [2,-1], [3,-2], [4,-2], [5,-2], [6,-1], [6,0], [6,1], [5,2], [4,3], [3,3], [2,3],
                [1,3], [0,4], [-1,5], [-2,5], [-3,5], [-4, 4], [-5,3], [-5,2], [-4,1], [-4,0], [-3,0], [-2,0], [-1,0]];
        }
        else if (index == 3) {
            return [[0,-1], [1,0], [1,1], [2,-1], [3,-2], [4,-1], [5,-2], [6,-1], [6,0], [5,1], [4,2], [3,3], [2,3], [-2,2],
                [1,3], [0,3], [-1,4], [-2,5], [-3,5], [-4,5], [-5,4], [-6,3], [-6,2], [-5,1], [-4,0], [-3,1], [-2,0], [-1,-1]];
        }
        else if (index == 4) {
            return [[-1, -1], [-2, -1], [-3, -1], [-3, 0], [-4, 0], [-5, 1],
                [-4, 2], [-3, 2], [-2, 2], [-1, 2], [1, 3], [2, 3], [3, 3],
                [4, 4], [5, 5], [6, 5], [7, 5], [8, 4], [9, 3], [10, 3],
                [11, 2], [10, 1], [9, 1], [8, 1], [7, 1], [6, 1], [5, 1],
                [4, 1], [3, 1], [2, 1], [4, 0], [4, -1], [3, -2], [2, -2],
                [1, -2], [0, -2], [0, 2]];
        }
        else if (index == 5) {
            return [[-1,0], [-2,0], [0,-2], [-1,-2], [-2,-2], [-3,-2], [-4,-2], [1,-2], [2,-2], [3,-2], [4,-2], [5,-2], [6,-1],
            [5,0], [4,0], [3,0], [5,1], [4,2], [3,2], [2,1], [1,1], [0,2], [1,3], [0,4], [-1,4], [-2,5], [-3,5], [-4,5], [-5,5], [-6,5], [-7,5],
            [-8,4], [-7,3], [-8,3], [-9,2], [-8,1], [-7,1], [-8,0], [-7,-1], [-6,-1], [-5,-1], [-2,2], [-4,3]];
        }
        if (index == 2) {
            return [[-3,-2],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[3,-2],[4,-2],[5,-2],
                [-4,1],[6,1],
                [-3,0],[-2,0],[-1,0],[5,0],
                [-4,1],[6,1],
                [-4,2],[-3,2],[-2,2],[5,2],
                [-6,3],[-5,3],[4,3],
                [-7,4],[0,4],[1,4],[2,4],[3,4],
                [-6,5], [-5,5], [-4,5], [-3,5], [-2,5], [-2,5], [-1,5]
            ]
        }
    }
    display(context, program_state) {
        super.display(context, program_state);
        const brown = hex_color("#7B3F00");

        if (this.bg_music) {
            this.background_music.play();
        } else {
            this.background_music.pause();
        }

        if (this.i == 0) {
            const camera_position = vec3(10, 2, -18);
            const target_position = vec3(8.5, 0, 0);
            const up_vector = vec3(0, 1, 0);
            const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

            // Set the camera matrix in the program state
            program_state.set_camera(camera_matrix);

            let square_transform = Mat4.identity();
            let T1 =  Mat4.translation(10.5, 1, 0);
            let S1 =  Mat4.scale(7.5, 7.5, 0);
            square_transform = square_transform.times(T1).times(S1);
            this.shapes.square.draw(context, program_state, square_transform, this.materials.title);
            this.shapes.block.draw(context, program_state, Mat4.identity(), this.materials.metal);
        }

        if (this.i >= 1 && this.i < 6) {

            // Set camera position and target position
            const camera_position = vec3(10, 10, -20);
            const target_position = vec3(0, 0, 0);
            const up_vector = vec3(0, 1, 0);

            // Create the camera matrix using the look_at function
            const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

            // Set the camera matrix in the program state
            program_state.set_camera(camera_matrix);
            // program_state.set_camera(Mat4.translation(0, 0, -25));
            let model_transform = this.current;
            model_transform = this.draw_block(context, program_state, model_transform, brown);
            this.prev = model_transform;

            let tiles_transform = Mat4.identity();

            if ((this.goal_position[0] == this.cube_1_position[0]) && (this.goal_position[0] == this.cube_2_position[0])
                && (this.goal_position[1] == this.cube_1_position[1]) && (this.goal_position[1] == this.cube_2_position[1])) {
                this.i += 1;
                // resets all of the variables to reset block information
                if (this.i == 6) {
                    console.log("GAME OVER");
                }
                else {
                    this.next_stage();
                }
            }
            const boundaries = this.check_boundaries(this.i);
            for (let a = 0; a < boundaries.length; a++) {
                let x = boundaries[a][0];
                let y = boundaries[a][1];
                console.log(x);
                console.log(y);
                console.log(this.cube_2_position);
                console.log(this.cube_1_position);
                if ((this.cube_1_position[0] == x && this.cube_1_position[1] == y) ||
                    (this.cube_2_position[0] == x && this.cube_2_position[1] == y)) {
                    console.log("DIE");
                    this.i = 7;
                }
            }
            // TILES PLATFORM
            // select_tile chooses what platform to display depending on i, which is the level number
            let level_transform = Mat4.identity();
            let S1 = Mat4.scale(2, 2, 0);
            let T1 = Mat4.translation(8, 7, 0);
            level_transform = level_transform.times(T1).times(S1);

            this.select_tile(context, program_state, tiles_transform, this.i);
            this.select_level(context, program_state, level_transform, this.i);
        }
        if (this.i == 6) {
            const camera_position = vec3(0, 0, -18);
            const target_position = vec3(0, 0, 0);
            const up_vector = vec3(0, 1, 0);
            const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

            // Set the camera matrix in the program state
            program_state.set_camera(camera_matrix);

            let square_transform = Mat4.identity();
            let S1 =  Mat4.scale(7.5, 7.5, 0);
            square_transform = square_transform.times(S1);
            this.shapes.square.draw(context, program_state, square_transform, this.materials.win);
        }
        if (this.i == 7) {
            const camera_position = vec3(0, 0, -18);
            const target_position = vec3(0, 0, 0);
            const up_vector = vec3(0, 1, 0);
            const camera_matrix = Mat4.look_at(camera_position, target_position, up_vector);

            // Set the camera matrix in the program state
            program_state.set_camera(camera_matrix);

            let square_transform = Mat4.identity();
            let S1 =  Mat4.scale(7.5, 7.5, 0);
            square_transform = square_transform.times(S1);
            this.shapes.square.draw(context, program_state, square_transform, this.materials.restart);
        }
        this.i = 5;
    }
}