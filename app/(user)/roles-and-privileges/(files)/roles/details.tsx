import { HeaderCard } from "@/components/ui/header-card"
import { EntityHeader } from "@/components/ui/entity-header"
import { splitSnakeCase } from "@/lib/utils/helperFns"
import { Checkbox } from "@/components/ui/checkbox"
import { privilegesApi, Privilege } from "@/lib/privileges-api"
import { updateRole } from "@/lib/roles-api"
import { useDataTable } from "@/hooks/useDataTable"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import useDashboardProps from "@/components/context/dashboard-global/useDashboardProps"

interface RoleDetailsProps {
  data: any
  moreActions?: Array<{ label: string; icon: any; onClick: () => void }>
  onUpdate?: () => void
}

export function RoleDetails({ data, onUpdate }: RoleDetailsProps) {
  const { fetchData } = useDataTable({ api: privilegesApi });
  const [allPrivileges, setAllPrivileges] = useState<any[]>([])
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { detailsSliderOpen, setDetailsSliderOpen } = useDashboardProps()

  const assignedPrivileges: string[] = data?.privileges?.map((item: any) => item.code) ?? [];

  const fetchPrivileges = async () => {
    const response = await fetchData({ page: 1 })
    setAllPrivileges(response?.data?.map((item: any) => ({
      name: item.name || splitSnakeCase(item.code),
      id: item.id,
      code: item.code,
      module: item.module,
    })) ?? [])
  }

  const handleSavePrivileges = async () => {
    setLoading(true)
    try {
      // Combine currently assigned + newly selected privilege IDs
      const allSelected = allPrivileges.filter(
        (p) => assignedPrivileges.includes(p.code) || selectedCodes.includes(p.code)
      )
      const privilegeIds = allSelected.map((p) => p.id)

      const res: any = await updateRole(data.id, {
        name: data.name,
        description: data.description,
        privilegeIds,
      })
      if (res?.code === 200 && detailsSliderOpen === true) {
        setDetailsSliderOpen(false)
        onUpdate?.()
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false)
    }
  }

  const handleUnassign = async (item: any) => {
    setLoading(true)
    try {
      // Remove this privilege from the role by sending all IDs except this one
      const remainingIds = data.privileges
        .filter((p: any) => p.code !== item.code)
        .map((p: any) => p.id)

      const res: any = await updateRole(data.id, {
        name: data.name,
        description: data.description,
        privilegeIds: remainingIds,
      })
      if (res?.code === 200 && detailsSliderOpen === true) {
        setDetailsSliderOpen(false)
        onUpdate?.()
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrivileges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSelectedCodes([])
  }, [data])

  return (
    <>
      <EntityHeader
        imageSrc={data.avatar?.default}
        name={data.name}
        email={data.description}
        status={data.systemRole ? 'system' : 'custom'}
      />

      <HeaderCard
        title="Users Assigned">
        <div className="space-y-3">
          {(!data?.users || data?.users?.length === 0) ? (
            <div className="text-muted-foreground text-sm">
              No users assigned to this role
            </div>
          ) : (
            data?.users?.map((item: any, index: number) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg dark:bg-muted/20 border border-border"
              >
                <div className="w-8 h-8 rounded-full bg-primary/80 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item?.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </HeaderCard>

      <HeaderCard
        title="Role Privileges">
        <div className="space-y-3 divide-y">
          {data?.privileges?.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No privileges assigned to this role
            </div>
          ) : data?.privileges?.map((item: any, idx: number) => (
            <div className="py-5" key={idx}>
              <div className="w-full flex-btw">
                <div>
                  <p className="mb-px font-semibold">
                    {item.name || splitSnakeCase(item?.code)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {item?.module}
                  </span>
                </div>

                <button
                  disabled={loading}
                  onClick={() => handleUnassign(item)}
                  className="px-2.5 py-1 flexed bg-cms-orange-10 text-white rounded-md text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  Unassign
                </button>
              </div>
            </div>
          ))}
        </div>
      </HeaderCard>

      <HeaderCard title={`Assign Privileges to ${data.name}`}>
        {!allPrivileges?.length ? (
          <div className="text-muted-foreground text-sm">
            Fetching available privileges...
          </div>
        ) : (
          <>
            <div className="space-y-5 overflow-y-scroll pl-2">
              {allPrivileges
                .filter((item) => !assignedPrivileges.includes(item.code))
                .map((privilege) => {
                  const value = privilege.code;
                  return (
                    <label
                      key={value}
                      className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCodes.includes(value)}
                        className="disabled:!cursor-not-allowed"
                        disabled={loading}
                        onChange={() =>
                          setSelectedCodes((prev) =>
                            prev.includes(value)
                              ? prev.filter((c) => c !== value)
                              : [...prev, value]
                          )
                        }
                      />
                      <span>{privilege.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{privilege.module}</span>
                    </label>
                  );
                })}
            </div>

            <div className="w-max ml-auto mt-7">
              <Button
                loading={loading}
                onClick={handleSavePrivileges}
                disabled={selectedCodes.length === 0}
                variant="login">
                Assign Privileges
              </Button>
            </div>
          </>
        )}
      </HeaderCard>
    </>
  )
}
