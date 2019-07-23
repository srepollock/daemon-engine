import { BoxGeometry, Geometry, Material, Mesh, MeshBasicMaterial } from "three";
import { Component } from "../components/component";
import { Vector3 } from "../math";
import { DObject } from "./dobject";
import { ErrorCode, log, LogLevel } from "./loggingsystem/src";

/**
 * The Daemon's entity object for game objects. The engine uses an
 * Entity->Component system for all game objects for easy object manipulation
 * and game object creation.
 */
export class Entity extends DObject {
    public name: string;
    public transform: Vector3;
    public components: Array<Component>;
    public children: Array<Entity>;
    private _geometry: Geometry;
    private _material: Material;
    private _mesh: Mesh;
    private _parent: string;
    /**
     * Entity constructor
     * @param id Entity's id for object uniqueness. Defaults to "".
     * @param transform Entities transform or world position.
     * @param children Entities child objects as there can be children attached 
     * to the entity.
     * @param components Entities components as an array attached to the object.
     * These can be engine default components or user defined components. 
     * Any new component that derives from the base Component class can be used 
     * here.
     * @see Component
     */
    constructor({name, tag, transform, geometry, material, mesh, components, parent, children}: {
        name?: string,
        tag?: string,
        transform?: Vector3,
        geometry?: Geometry,
        material?: Material,
        mesh?: Mesh,
        components?: Array<Component>,
        parent?: Entity,
        children?: Array<Entity>
    } = {}) {
        super(tag);
        this.name = (name) ? name : `${this.tag + " " + this.id}`;
        this.transform = (transform) ? transform : new Vector3();
        this._geometry = (geometry) ? geometry : new BoxGeometry(1, 1, 1);
        this._material = (material) ? material : new MeshBasicMaterial({color: 0x00ff00});
        this._mesh = (mesh) ? mesh : new Mesh(geometry, material);
        this.components = (components) ? components : new Array();
        log(LogLevel.debug, `Setting parent of ${this.id} to ${parent}`);
        this._parent = (parent) ? parent.id : "";
        this.children = (children) ? children : new Array();
        for (let i in this.children) this.children[i].setParent(this);
    }
    /**
     * Gets the parent object's ID.
     * @returns (parent object's ID | "")
     */
    public get parent(): string {
        if (this._parent !== "") return this._parent;
        log(LogLevel.error, `You tried to get the parent of ${this.id} that has no parent`, 
            ErrorCode.EntityParentUndefined);
        return "";
    }
    public get geometry(): Geometry {
        return this._geometry;
    }
    public set geometry(geometry: Geometry) {
        this._geometry = geometry;
    }
    public get material(): Material {
        return this._material;
    }
    public set material(material: Material) {
        this._material = material;
    }
    public get mesh(): Mesh {
        return this._mesh;
    }
    public set mesh(mesh: Mesh) {
        this._mesh = mesh;
    }
    /**
     * Sets parent object of entity.
     * @param  {Entity} entity
     */
    public setParent(entity: Entity): void {
        this._parent = entity.id;
    }
    /**
     * Removes the parent from the entity.
     * @returns void
     */
    public removeParent(): void {
        this._parent = "";
    }
    /**
     * Adds a child to the array
     * @param  {Entity} entity
     * @returns void
     */
    public addChild(entity: Entity): void {
        if (!this.hasChild(entity.id)) {
            entity.setParent(this);
            this.children!.push(entity);
        } else {
            log(LogLevel.error, `${this.id} already has child ${entity.id}`, ErrorCode.EntityAlreadyHasChild);
        }
    }
    /**
     * Add multiple children to the object.
     * @param  {Array<Entity>} entities
     * @returns void
     */
    public addChildren(entities: Array<Entity>): void {
        entities.forEach((entity) => {
            this.addChild(entity);
        });
    }
    /**
     * Add a component to the entity. There can only be one instance of a 
     * component type on the object at one time. This will log an error if
     * there is a breach of this rule.
     * @param  {Component} component The component to be added.
     * @returns void
     */
    public addComponent(component: Component): void {
        if (!this.hasComponent(component.tag)) {
            this.components!.push(component);
        } else {
            // tslint:disable-next-line:max-line-length
            log(LogLevel.error, `This entity object alread has the ${component.id} attached.`, ErrorCode.EntityAlreadyHasComponent);
        }
    }
    /**
     * Add multiple components as an array to the entity object.
     * @param  {Array<Component>} ...components
     */
    public addComponents(components: Array<Component>): void {
        for (let comp of components) {
            this.addComponent(comp);
            // this.components!.push(comp);
        }
    }
    /**
     * Checks if the entity has the child or not.
     * @param  {string} id Entity unique id
     * @returns boolean
     */
    public hasChild(id: string): boolean {
        // https://stackoverflow.com/questions/46348749/ts-property-find-does-not-exist-on-type-myarray
        // let entity = this.children.find((e) => e.id === id);
        let entity = this.children.filter((e) => e.id === id).shift();
        if (entity !== undefined) return true;
        else return false;
    }
    /**
     * Checks if the entity has the component or not.
     * REVIEW: This should be searching by ID
     * @param  {string} type Component tag name
     * @returns boolean
     */
    public hasComponent(type: string): boolean {
        let comp = this.components!.filter((comp) => comp.tag! === type).shift();
        if (comp !== undefined) return true;
        else return false;
    }
    /**
     * Gets child entity from children.
     * TODO: This should be handled in hasChild(string). There needs to be 
     * another way of doing this.
     * @param  {string} id
     * @returns Entity
     */
    public getChild(id: string): Entity | undefined {
        let entity = this.children!.filter((entity) => entity.id === id).shift();
        if (entity !== undefined) { 
            return entity!;
        } else {
            log(LogLevel.warning, `Child ${id} not found`, ErrorCode.EntityChildNotFound);
            return undefined;
        }
    }
    /**
     * Gets all the children from the object.
     * @returns Array
     */
    public getChildren(): Array<Entity> {
        return this.children;
    }
    /**
     * Gets the component named that is attached to the entity.
     * @param  {string} type
     * @returns Component
     */
    public getComponent(type: string): Component | undefined {
        let comp = this.components!.filter((comp) => comp.tag! === type).shift();
        if (comp !== undefined) { 
            return comp!;
        } else {
            log(LogLevel.warning, "Component not found", ErrorCode.EntityComponentNotFound);
            return undefined;
        }
    }
    /**
     * Returns the object as a string.
     * @returns string
     */
    public toString(): string {
        let objectString = `Entity [id:${this.id}]`;
        log(LogLevel.debug, objectString);
        return objectString;
    }
    /**
     * Udpates the current object
     * @param  {number} delta
     * @returns void
     */
    public update(delta: number): void {
        
    }
}