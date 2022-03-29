export class Audio {
    id: number;
    title: string;
    soundcloud_code: string;
    color: string;
    favorite: boolean;


    constructor(id: number, title: string, color: string, favorite: boolean, soundcloud_code: string) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.favorite = favorite;
        this.soundcloud_code = soundcloud_code;
    }
}
