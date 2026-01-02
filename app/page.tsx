import { getVisitedCountries } from '@/app/actions/countries'
import { createServerClient } from '@/utils/supabase/server'
import CountryForm from '@/components/CountryForm'
import CountryList from '@/components/CountryList'
import AuthTabs from '@/components/AuthTabs'
import AuthButton from '@/components/AuthButton'

export default async function Home() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const countries = user ? await getVisitedCountries() : []

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Visited Countries
          </h1>
          <p className="text-gray-600">
            Track the countries you&apos;ve visited
          </p>
        </div>

        {user ? (
          <>
            <div className="mb-6 flex justify-end">
              <AuthButton userEmail={user.email || ''} />
            </div>
            <div className="mt-8">
              <CountryForm existingCountries={countries} />
              <CountryList countries={countries} />
            </div>
          </>
        ) : (
          <div className="mt-8">
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-2">
                Please sign in or create an account to track your visited countries.
              </p>
            </div>
            <AuthTabs />
          </div>
        )}
      </div>
    </main>
  )
}
