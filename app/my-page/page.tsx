import { createServerClient } from '@/utils/supabase/server'
import { getUserProfile } from '@/app/actions/profile'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import ChangeEmailForm from '@/components/ChangeEmailForm'

export default async function MyPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const profile = await getUserProfile()

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-12 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">My Page</h1>
        </div>

        <div className="space-y-8">
          {/* Profile Information Section */}
          <div className="bg-white p-6 rounded-[5px] shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Profile Information
            </h2>
            <ProfileForm
              initialProfile={{
                nationality: profile?.nationality || null,
                language: profile?.language || null,
                hobbies: profile?.hobbies || null,
              }}
            />
          </div>

          {/* Change Email Section */}
          <div className="bg-white p-6 rounded-[5px] shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Change Email
            </h2>
            <ChangeEmailForm currentEmail={user.email || ''} />
          </div>

          {/* Change Password Section */}
          <div className="bg-white p-6 rounded-[5px] shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Change Password
            </h2>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </main>
  )
}

