import type { Component } from "solid-js"

import styles from "./app.module.css"
import Simulation from "./simulation/simulation"

const App: Component = () => {
    return (
        <div class={styles.App}>
            <Simulation />
        </div>
    )
}

export default App
