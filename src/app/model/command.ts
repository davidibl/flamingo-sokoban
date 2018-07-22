import { IPosition } from './position';

export class Command {
    public static ArrowUp = (position, value) => new IPosition(position.x, position.y - value);
    public static ArrowDown = (position, value) => new IPosition(position.x, position.y + value);
    public static ArrowRight = (position, value) => new IPosition(position.x + value, position.y);
    public static ArrowLeft = (position, value) => new IPosition(position.x - value, position.y);
}
