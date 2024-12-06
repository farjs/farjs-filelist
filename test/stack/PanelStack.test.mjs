import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import PanelStackItem from "../../src/stack/PanelStackItem.mjs";
import PanelStack from "../../src/stack/PanelStack.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const Component = () => {
  return null;
};
const OtherComponent = () => {
  return null;
};

describe("PanelStack.test.mjs", () => {
  it("should create new stack and set isActive", () => {
    //when & then
    assert.deepEqual(new PanelStack(true, [], mockFunction()).isActive, true);
    assert.deepEqual(new PanelStack(false, [], mockFunction()).isActive, false);
  });

  it("should push new item when push", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const data = [new PanelStackItem(Component), new PanelStackItem(Component)];
    const newItem = new PanelStackItem(OtherComponent);

    //when
    stack.push(newItem);

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result, [newItem, ...data]);
  });

  it("should do nothing if empty stack data when update", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const data = /** @type {PanelStackItem<any>[]} */ ([]);

    //when
    stack.update((_) => _.withState({}));

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result === data, true);
  });

  it("should update single item when update", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const data = [new PanelStackItem(Component)];
    const params = { name: "test" };

    //when
    stack.update((_) => _.withState(params));

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result, [
      new PanelStackItem(Component, undefined, undefined, params),
    ]);
  });

  it("should update top item when update", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const top = new PanelStackItem(Component);
    const other1 = new PanelStackItem(OtherComponent);
    const other2 = new PanelStackItem(OtherComponent);
    const data = [top, other1, other2];
    const params = { name: "test" };

    //when
    stack.update((_) => _.withState(params));

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result, [
      new PanelStackItem(Component, undefined, undefined, params),
      other1,
      other2,
    ]);
  });

  it("should update item when updateFor", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const top = new PanelStackItem(Component);
    const other = new PanelStackItem(OtherComponent);
    const data = [top, other];
    const params = { name: "test" };

    //when
    stack.updateFor(OtherComponent, (_) => _.withState(params));

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result, [
      top,
      new PanelStackItem(OtherComponent, undefined, undefined, params),
    ]);
  });

  it("should remove top component when pop", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const other = new PanelStackItem(OtherComponent);
    const data = [new PanelStackItem(Component), other];

    //when
    stack.pop();

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result, [other]);
  });

  it("should not remove last item when pop", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const data = [new PanelStackItem(Component)];

    //when
    stack.pop();

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result === data, true);
  });

  it("should remove all except last item when clear", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const other = new PanelStackItem(OtherComponent);
    const data = [
      new PanelStackItem(Component),
      new PanelStackItem(Component),
      other,
    ];

    //when
    stack.clear();

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result, [other]);
  });

  it("should not remove last item when clear", () => {
    //given
    let result = null;
    const updater = mockFunction((updateFn) => {
      result = updateFn(data);
    });
    const stack = new PanelStack(false, [], updater);
    const data = [new PanelStackItem(Component)];

    //when
    stack.clear();

    //then
    assert.deepEqual(updater.times, 1);
    assert.deepEqual(result === data, true);
  });

  it("should return top item when peek", () => {
    //given
    const top = new PanelStackItem(Component);
    const other = new PanelStackItem(OtherComponent);
    const stack = new PanelStack(false, [top, other], mockFunction());

    //when & then
    assert.deepEqual(stack.peek() === top, true);
    assert.deepEqual(stack.peek() === top, true);
  });

  it("should throw error if empty stack when peek", () => {
    //given
    const stack = new PanelStack(false, [], mockFunction());
    let error = null;

    try {
      //when
      stack.peek();
    } catch (e) {
      error = e;
    }

    //then
    assert.deepEqual(error, Error("PanelStack is empty!"));
  });

  it("should return last item when peekLast", () => {
    //given
    const top = new PanelStackItem(Component);
    const other = new PanelStackItem(OtherComponent);
    const stack = new PanelStack(false, [top, other], mockFunction());

    //when & then
    assert.deepEqual(stack.peekLast() === other, true);
    assert.deepEqual(stack.peekLast() === other, true);
  });

  it("should throw error if empty stack when peekLast", () => {
    //given
    const stack = new PanelStack(false, [], mockFunction());
    let error = null;

    try {
      //when
      stack.peekLast();
    } catch (e) {
      error = e;
    }

    //then
    assert.deepEqual(error, Error("PanelStack is empty!"));
  });

  it("should return top item state when params", () => {
    //given
    const params = { name: "test" };
    const top = new PanelStackItem(Component, undefined, undefined, params);
    const other = new PanelStackItem(OtherComponent, undefined, undefined, {});
    const stack = new PanelStack(false, [top, other], mockFunction());

    //when & then
    assert.deepEqual(stack.params() === params, true);
    assert.deepEqual(stack.params() === params, true);
  });

  it("should throw error if empty stack when params", () => {
    //given
    const stack = new PanelStack(false, [], mockFunction());
    let error = null;

    try {
      //when
      stack.params();
    } catch (e) {
      error = e;
    }

    //then
    assert.deepEqual(error, Error("PanelStack is empty!"));
  });
});
