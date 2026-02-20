# NodeJS Async Execution Order Tests

This directory contains two test files that explore fundamental concepts of asynchronous execution in NodeJS.

## Files

### 1. `event_loop_execution_order.mjs`

This file demonstrates the **execution order of different asynchronous APIs** in NodeJS's event loop. It helps understand the priority and timing of:

- **Synchronous code** (`console.log` statements)
- **Promise initialization** (code inside the `Promise` constructor)
- **Microtasks** (`queueMicrotask()`)
- **Process.nextTick** (`process.nextTick()`)
- **Promise callbacks** (`.then()`)
- **Immediate callbacks** (`setImmediate()`)

**Key Learning**: The file reveals the execution order hierarchy in NodeJS:
1. Synchronous code runs first
2. `process.nextTick()` callbacks execute before other microtasks
3. Promise callbacks and `queueMicrotask()` execute as microtasks
4. `setImmediate()` executes in the next iteration of the event loop

Each callback includes a stack trace to help visualize where and when it executes.

### 2. `async_functions_run_synchronously_until_the_first_await.mjs`

This file demonstrates that **async functions execute synchronously until the first `await` keyword** is encountered. 

**Key Learning**: 
- When you call an async function, the code before the first `await` runs immediately and synchronously
- The function only becomes asynchronous (returns control to the caller) when it hits an `await`
- Code after the `await` runs asynchronously once the awaited promise resolves

The test tracks a `context` array to show:
1. Initial state: `[]`
2. After calling `run()`: `[1]` - code before `await` has already executed
3. After awaiting the promise: `[1, 3]` - code after `await` has now executed
