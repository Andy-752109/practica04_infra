/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { validateUserForm } from "./validator";

export interface Env {
  p6: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Endpoint POST para validar el formulario y guardar en la base de datos
    if (url.pathname === "/user" && request.method === "POST") {
      try {
        const body: any = await request.json();
        const validation = validateUserForm(body?.name, body?.email);

        if (!validation.isValid) {
          return new Response(JSON.stringify({ error: validation.error }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Inserta en la base de datos D1 del ambiente activo
        await env.p6.prepare("INSERT INTO users (name) VALUES (?)").bind(body.name).run();

        return new Response(
          JSON.stringify({ message: "Usuario validado y guardado con éxito", data: body }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        );
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || "JSON inválido" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 2. Ruta por defecto (GET): Consulta la base de datos tal como lo tenías
    try {
      const data = await this.queryDatabase(env.p6);
      return Response.json({ message: "Hello World 3!", dbData: data });
    } catch (e: any) {
      return Response.json({ error: "Error al consultar la base de datos" }, { status: 500 });
    }
  },

  async queryDatabase(db: D1Database) {
    const { results } = await db.prepare("SELECT * FROM users").all();
    return results;
  }
} satisfies ExportedHandler<Env>;