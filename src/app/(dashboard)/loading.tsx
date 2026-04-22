export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="skel w-40 h-7 rounded-lg" />
          <div className="skel w-60 h-4 mt-2 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-box">
            <div className="skel w-20 h-3 rounded" />
            <div className="skel w-24 h-8 mt-3 rounded-lg" />
            <div className="skel w-full h-8 mt-4 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-box">
          <div className="skel w-48 h-4 rounded" />
          <div className="skel w-full h-24 mt-4 rounded-lg" />
        </div>
        <div className="card-box">
          <div className="skel w-48 h-4 rounded" />
          <div className="skel w-full h-24 mt-4 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-box lg:col-span-2">
          <div className="skel w-40 h-4 rounded" />
          <div className="space-y-3 mt-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="skel w-24 h-3 rounded" />
                  <div className="skel w-20 h-3 rounded" />
                </div>
                <div className="skel w-full h-1.5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="card-box">
          <div className="skel w-32 h-4 rounded" />
          <div className="space-y-3 mt-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skel w-10 h-8 rounded" />
                <div className="flex-1">
                  <div className="skel w-3/4 h-3 rounded" />
                  <div className="skel w-1/2 h-2.5 mt-1.5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
