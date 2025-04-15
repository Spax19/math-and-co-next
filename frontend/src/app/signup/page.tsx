'use client'

import { signup } from '../actions/auth'
import { useActionState } from 'react'

export default async function Signup(state, formData) {
    // const [state, action, pending] = useActionState(signup, undefined)
    // // 2. Prepare data for insertion into database
    // const { name, email, password } = validatedFields.data
    // // e.g. Hash the user's password before storing it
    // const hashedPassword = await bcrypt.hash(password, 10)

    // // 3. Insert the user into the database or call an Library API
    // const data = await db
    //     .insert(users)
    //     .values({
    //         name,
    //         email,
    //         password: hashedPassword,
    //     })
    //     .returning({ id: users.id })

    // const user = data[0]

    // if (!user) {
    //     return {
    //         message: 'An error occurred while creating your account.',
    //     }
    // }
    return (
        <form >
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" placeholder="Name" />
            </div>
            {state?.errors?.name && <p>{state.errors.name}</p>}

            <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" placeholder="Email" />
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}

            <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
            </div>
            {state?.errors?.password && (
                <div>
                    <p>Password must:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button type="submit">
                Sign Up
            </button>
        </form>
    )
}

