import { SignupFormSchema } from '@/app/lib/definitions'
import { cookies } from 'next/headers'
import { deleteSession } from '../../lib/session'


export async function signup(state, formData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Call the provider or db to create a user...
}

export async function logout() {
    deleteSession()
    redirect('/login')
}