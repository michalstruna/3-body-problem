import { Viewport } from "pixi-viewport"
import { Application, Assets, BlurFilter, Graphics, Sprite } from "pixi.js"

type InitParams = {
    root: HTMLElement
}

export const init = async ({ root }: InitParams) => {
    const app = new Application()
    await app.init({ resizeTo: window })
    root.appendChild(app.canvas)

    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 10000,
        worldHeight: 10000,
        events: app.renderer.events,
    })

    const texture = await Assets.load("/img/background/1.jpg")
    const background = Sprite.from(texture)
    background.alpha = 0.8
    const blurFilter = new BlurFilter(5)
    background.filters = [blurFilter]
    background.width = 4000
    background.height = 2000
    background.y = -background.height / 2
    background.x = -background.width / 2

    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()
        .clamp({
            direction: "all",
            underflow: "center",
        })
        .clampZoom({
            maxWidth: viewport.worldWidth / 2,
            maxHeight: viewport.worldHeight / 2,
            minHeight: 200,
        })

    app.stage.addChild(background)
    app.stage.addChild(viewport)

    const G = 0.005

    const createBody = ({
        x = 0,
        y = 0,
        vx = 0,
        vy = 0,
        mass = 1,
        color = 0xaaaaaa,
    }) => {
        const body = new Graphics()
            .circle(0, 0, Math.sqrt(mass))
            .fill({ color })
        body.mass = mass
        body.x = x
        body.y = y
        body.vx = vx
        body.vy = vy
        viewport.addChild(body)
        return body
    }

    const bodies = [
        createBody({ mass: 512, x: 500, y: 500, color: 0xaaaaaa }),
        createBody({ mass: 9, x: 550, y: 500, color: 0x888888, vy: 1 }),
        createBody({ mass: 16, x: 600, y: 500, color: 0x888888, vy: -1 }),
        createBody({ mass: 25, x: 700, y: 500, color: 0x888888, vy: 2 }),
        createBody({ mass: 25, x: 800, y: 500, color: 0x888888, vy: 2 }),
        createBody({ mass: 4, x: 810, y: 500, color: 0x888888, vy: 2.1 }),
        createBody({ mass: 16, x: 900, y: 500, color: 0x888888, vy: 2 }),
    ]

    // viewport.follow(bodies[1])

    app.ticker.add(() => {
        for (const source of bodies) {
            for (const target of bodies) {
                if (source === target) continue

                const dx = target.x - source.x
                const dy = target.y - source.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const force =
                    (G * target.mass * source.mass) / (distance * distance)

                const ax = (force * dx) / source.mass
                const ay = (force * dy) / source.mass

                source.vx += ax
                source.vy += ay

                source.x += source.vx
                source.y += source.vy
            }
        }

        background.position.set(
            -viewport.center.x / 20,
            -viewport.center.y / 20,
        )
        blurFilter.blur = viewport.scale.x * 5
    })
}
