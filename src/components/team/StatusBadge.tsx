"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSocket } from '@/src/context/socketConnection';
import { Badge } from '../ui/badge';

const StatusBadge = ({ image = "", name, userId }: { image: string, name: string, userId: string }) => {
  const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    // active: { label: "Active", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
    // away: { label: "Away", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", dot: "bg-yellow-500" },
    offline: { label: "Offline", color: "bg-muted text-muted-foreground border-muted", dot: "bg-muted-foreground/40" },
    online: { label: "Online", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-green-500 " }
  };

  const { userStatuses } = useSocket();

  const statusCfg = STATUS_CONFIG[userStatuses[userId] ?? "offline"] ?? STATUS_CONFIG.offline;
  return (
    <div className="relative flex-shrink-0">
      <Avatar className="h-12 w-12">
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {name.split(" ").map(n => n[0]).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusCfg.dot}`} />
       <Badge variant="outline" className={`absolute -bottom-0.6 -right-0.5  rounded-full border-2 border-card ${statusCfg.color}`}>
                                {statusCfg.label}
                            </Badge>
            {/* <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${statusCfg.dot}`} /> */}
    </div>
  )
}

export default StatusBadge