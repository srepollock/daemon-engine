import { Component } from "../../../src/components";
import { DObject, Entity } from "../../../src/core";
import { guid } from "../../../src/helper";
import { Vector3 } from "../../../src/math";
describe("Entity Class Unit Tests", () => {
    var entity: Entity;
    beforeEach(() => {
        entity = new Entity();
    });
    it("should be an instance of DObject", () => {
        expect(new Entity()).toBeInstanceOf(DObject);
    });
    describe("Child entity objects", () => {
        it("should be instantiated with a parent ID", () => {
            let child: Entity = new Entity({parent: entity});
            expect(child.parent).toBe(entity.id);
        });
        it("should be able to add a child to the entity object", () => {
            let child = new Entity({parent: entity});
            let c1 = new Entity();
            child.addChild(c1);
            expect(child.getChild(c1.id));
        });
        it("should not be able to add the same object as a child twice", () => {
            let child = new Entity({parent: entity});
            let c1 = new Entity();
            child.addChild(c1);
            expect(child.getChild(c1.id));
            child.addChild(c1);
            expect(child.getChildren().length).toBe(1);
        });
        it("should get 1 child entity object", () => {
            let child = new Entity();
            entity.addChild(child);
            expect(entity.getChild(child.id)).not.toBeUndefined();
            expect(entity.getChild(child.id)).toEqual(child);
        });
        it("should have 1 child entity object", () => {
            let child = new Entity();
            entity.addChild(child);
            expect(entity.getChildren()).not.toBeUndefined();
            expect(entity.getChildren()).toHaveLength(1) ;
        });
        it("should fail to return the child when searching for it, if it doesn't exist", () => {
            expect(entity.getChild(guid())).toBeUndefined();
        });
        it("should have a child that has the parent ID", () => {
            let child = new Entity();
            entity.addChild(child);
            expect(entity.getChildren()[0].parent).toBe(entity.id);
        });
    });
    describe("Empty Entity object", () => {
        let go1: Entity = new Entity();
        it("should have an empty tag", () => {
            expect(go1.tag).toBe("");
        });
        it("should be set to 0,0 coordinates", () => {
            expect(go1.transform).toEqual({x: 0, y: 0, z: 0});
        });
        it("should have no components", () => {
            expect(go1.components).toEqual([]);
        });
        it("should have no children", () => {
            expect(go1.components).toEqual([]);
        });
        it("should be able to print the object with asMessage()", () => {
            expect(go1.asMessage()).toStrictEqual(JSON.stringify(go1));
        });
        it("should be set to ready when the entire entity is loaded", () => {
            expect(go1.ready).toBe(true);
        });
    });
    describe("Entity object with tag", () => {
        let go2: Entity = new Entity({tag: "template"});
        it("should have an tag: \"template\"", () => {
            expect(go2.tag).toBe("template");
        });
        it("should be set to 0,0 coordinates", () => {
            expect(go2.transform).toEqual({x: 0, y: 0, z: 0});
        });
        it("should have no components", () => {
            expect(go2.components).toEqual([]);
        });
        it("should have no children", () => {
            expect(go2.components).toEqual([]);
        });
    });
    describe("Entity object with tag and new coordinates", () => {
        let go3: Entity = new Entity({tag: "template", transform: new Vector3(11, 23, 0)});
        it("should have an empty tag", () => {
            expect(go3.tag).toBe("template");
        });
        it("should be set to 11,23 coordinates", () => {
            expect(go3.transform).toEqual({x: 11, y: 23, z: 0});
        });
        it("should have no components", () => {
            expect(go3.components).toEqual([]);
        });
        it("should have no children", () => {
            expect(go3.components).toEqual([]);
        });
    });
    describe("Entity object with tag, new coordinates, and 1 component", () => {
        let comp1: Component = new Component("comp1");
        let go4: Entity = new Entity({tag: "template", 
            transform: new Vector3(30, -10, 0),
            components: new Array(comp1),
            children: new Array()
        });
        it("should have an empty tag", () => {
            expect(go4.tag).toBe("template");
        });
        it("should be set to 30,-10 coordinates", () => {
            expect(go4.transform).toEqual({x: 30, y: -10, z: 0});
        });
        it("should have a component", () => {
            expect(go4.components.length).toBe(1);
        });
        it("should be a basic component", () => {
            expect(go4.hasComponent("comp1")).toBe(true);
        });
        it("should have no children", () => {
            expect(go4.children).toEqual([]);
        });
        it("should get the component when calling 'getComponent' if it exists", () => {
            expect(go4.getComponent("comp1")).toBeInstanceOf(Component);
            expect(go4.getComponent("comp1")).not.toBeUndefined();
        });
        it("should get undefined for looking for a component that doesn't exist", () => {
            expect(go4.getComponent("comp4")).toBeUndefined();
        });
        it("should not be able to add the same component to the same object", () => {
            expect(go4.components.length).toBe(1);
            go4.addComponent(comp1);
            expect(go4.components.length).toBe(1);
        });
    });
    describe("Add components to object", () => {
        let go5: Entity = new Entity({});
        it("should add a new component", () => {
            go5.addComponent(new Component("comp1"));
            expect(go5.hasComponent("comp1")).toBe(true);
        });
        it("should add multiple components to the entity", () => {
            go5.addComponents(new Array(new Component("comp2"), new Component("comp3")));
            expect(go5.components.length).toBe(3);            
        });
    });
    describe("Entity object with tag, and parent", () => {
        let e = new Entity();
        let go6 = new Entity({tag: "player", parent: e}); 
        it("should have a parent", () => {
            expect(go6.parent).toBeDefined();
            expect(go6.parent).toBe(e.id);
        });
        it("should be able to remove and have no parent", () => {
            go6.removeParent();
            expect(go6.parent).toBe("");
        });
    });
});