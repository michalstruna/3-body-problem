import { createEffect } from "solid-js"
import { init } from "./lib"

const Simulation = () => {
	let root: HTMLDivElement | null = null


	createEffect(() => {
		init({ root: root! })
	})
	
    return <div ref={el => root = el}>

	</div>
}

export default Simulation
